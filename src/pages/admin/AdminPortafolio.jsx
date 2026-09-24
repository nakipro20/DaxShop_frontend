import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Upload,
  Brush,
  CheckCircle2,
  Search,
  Pencil,
  Trash2,
  X,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Colores tomados del design system del mockup DaxShop CMS.
// Si tu tailwind.config.js ya define estos tokens (primary, secondary-container,
// surface-container-*, etc.) puedes cambiar estos hex por esas clases.
const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fffbff',
  secondary: '#9d4300',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  surface: '#faf9f6',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
};

// Ajusta estos IDs para que coincidan con las categorías reales de tu backend.
const CATEGORIAS = [
  { id: 1, nombre: 'Ilustración Digital' },
  { id: 2, nombre: 'Tradicional / Tinta' },
  { id: 3, nombre: 'Fanart' },
  { id: 4, nombre: 'Diseño de Personajes' },
];

const TIPOS_PROYECTO = [
  { value: '1', nombre: 'Personal' },
  { value: '2', nombre: 'Comisión' },
  { value: '3', nombre: 'Comercial' },
];

const FORM_INICIAL = {
  title: '',
  category_id: 1,
  description: '',
  technique: '',
  completion_date: '',
  project_type: '1',
};

export default function AdminPortafolio() {
  // --- Alta / edición ---
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [imagen, setImagen] = useState(null);
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  // --- Listado / gestión ---
  const [obras, setObras] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [eliminandoId, setEliminandoId] = useState(null);

  const cargarObras = async () => {
    setCargandoLista(true);
    try {
      const respuesta = await api.get('/portafolio');
      setObras(respuesta.data.datos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    cargarObras();
  }, []);

  const obrasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return obras;
    return obras.filter((o) =>
      `${o.title || ''} ${o.technique || ''} ${o.category_name || ''}`.toLowerCase().includes(termino)
    );
  }, [obras, busqueda]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const resetFormulario = () => {
    setFormData(FORM_INICIAL);
    setImagen(null);
    setImagenPreviewUrl(null);
    setEditandoId(null);
  };

  // Precarga el formulario con los datos de una obra existente para editarla.
  const iniciarEdicion = (obra) => {
    const categoriaCoincidente = CATEGORIAS.find((c) => c.nombre === obra.category_name);
    const tipoCoincidente = TIPOS_PROYECTO.find((t) => t.nombre === obra.project_type);

    setEditandoId(obra.id);
    setFormData({
      title: obra.title || '',
      category_id: categoriaCoincidente ? categoriaCoincidente.id : 1,
      description: obra.description || '',
      technique: obra.technique || '',
      completion_date: obra.completion_date ? obra.completion_date.slice(0, 10) : '',
      project_type: tipoCoincidente ? tipoCoincidente.value : '1',
    });
    setImagen(null);
    setImagenPreviewUrl(obra.primary_image_url || null);
    setMensaje({ tipo: '', texto: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const payload = {
      ...formData,
      category_id: parseInt(formData.category_id),
    };

    try {
      let obraId = editandoId;

      if (editandoId) {
        // Actualizar obra existente.
        // Asume un endpoint PUT /portafolio/admin/actualizar/:id — ajusta el
        // nombre/método si tu backend expone la actualización de otra forma.
        await api.put(`/portafolio/admin/actualizar/${editandoId}`, payload);
      } else {
        // Crear la obra (texto)
        const resObra = await api.post('/portafolio/admin/crear', payload);
        obraId = resObra.data.obra_id;
      }

      // Subir imagen nueva (alta o reemplazo en edición)
      if (imagen) {
        const formImagen = new FormData();
        formImagen.append('imagen', imagen);
        formImagen.append('is_primary', 'true');

        await api.post(`/portafolio/admin/${obraId}/imagen`, formImagen);
      }

      setMensaje({
        tipo: 'exito',
        texto: editandoId
          ? '¡Obra actualizada exitosamente!'
          : '¡Obra publicada exitosamente en el portafolio!',
      });

      resetFormulario();
      cargarObras();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al guardar la obra.' });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (obra) => {
    const confirmado = window.confirm(`¿Eliminar "${obra.title}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    setEliminandoId(obra.id);
    try {
      // Asume un endpoint DELETE /portafolio/admin/eliminar/:id
      await api.delete(`/portafolio/admin/eliminar/${obra.id}`);
      setObras((prev) => prev.filter((o) => o.id !== obra.id));

      if (editandoId === obra.id) {
        resetFormulario();
      }
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar la obra.' });
    } finally {
      setEliminandoId(null);
    }
  };

  const categoriaNombre =
    CATEGORIAS.find((c) => c.id === parseInt(formData.category_id))?.nombre || 'Categoría';
  const tipoNombre =
    TIPOS_PROYECTO.find((t) => t.value === formData.project_type)?.nombre || 'Personal';

  return (
    <div className="font-['Rubik',sans-serif]" style={{ color: C.onSurface , marginTop: '20px'}}>
      <div className="mb-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 font-bold uppercase text-sm hover:underline w-max"
        >
          <ArrowLeft size={18} /> Volver al Panel
        </Link>
      </div>

      {mensaje.texto && (
        <div
          className="p-4 mb-6 font-bold text-sm rounded-lg"
          style={{
            boxShadow: `3px 3px 0 ${C.onSurface}`,
            backgroundColor: mensaje.tipo === 'exito' ? '#e3f8ea' : '#ffdad6',
            color: mensaje.tipo === 'exito' ? '#1c6b3a' : '#93000a',
          }}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* FORMULARIO */}
        <div
          className="xl:col-span-7 rounded-xl p-6 flex flex-col gap-5"
          style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
        >
          <div
            className="flex items-center justify-between gap-3 p-3 rounded-lg"
            style={{ backgroundColor: C.surfaceLow }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  boxShadow: `2px 2px 0 ${C.onSurface}`,
                }}
              >
                <Brush size={20} />
              </span>
              <div>
                <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight">
                  {editandoId ? 'Editar Obra' : 'Nueva Obra de Arte'}
                </h2>
                <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  {editandoId ? `Editando obra #${editandoId}` : 'Sube una pieza al portafolio de Daxth1.'}
                </p>
              </div>
            </div>

            {editandoId && (
              <button
                type="button"
                onClick={resetFormulario}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase shrink-0"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
              >
                <X size={14} /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Título de la Obra <span style={{ color: C.primary }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Sombra Cósmica"
                className="w-full px-4 py-2 rounded font-medium outline-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* Técnica */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Técnica
              </label>
              <input
                type="text"
                name="technique"
                value={formData.technique}
                onChange={handleChange}
                required
                placeholder="Ej: Acrílico, Digital..."
                className="w-full px-4 py-2 rounded font-medium outline-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Categoría
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded font-medium outline-none appearance-none cursor-pointer"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Fecha de Creación
              </label>
              <input
                type="date"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded font-medium outline-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* Tipo de proyecto */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Tipo de Proyecto
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded font-medium outline-none appearance-none cursor-pointer"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              >
                {TIPOS_PROYECTO.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Descripción / Concepto
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe el concepto, inspiración, proceso..."
                className="w-full px-4 py-2 rounded font-medium outline-none resize-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* Imagen */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Imagen de la Obra (JPG / PNG / WEBP)
              </label>
              <div
                className="rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer"
                style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: '#ffdbca', color: '#341100', boxShadow: `2px 2px 0 ${C.onSurface}` }}
                >
                  <Upload size={22} />
                </div>
                <label className="font-bold cursor-pointer">
                  {editandoId ? 'Reemplazar imagen (opcional)' : 'Arrastra la imagen o haz clic para subir'}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-xs mt-1" style={{ color: C.onSurfaceVariant }}>
                  Recomendado: alta resolución, buena iluminación.
                </p>
                {imagen && (
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: C.surfaceLowest, boxShadow: `1px 1px 0 ${C.onSurface}` }}
                    >
                      {imagen.name}
                    </span>
                    <CheckCircle2 size={16} style={{ color: C.primary }} />
                  </div>
                )}
              </div>
            </div>

            {/* Botón */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 py-4 rounded-lg font-extrabold uppercase tracking-wide transition-transform hover:-rotate-1 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  boxShadow: `4px 4px 0 ${C.onSurface}`,
                }}
              >
                {cargando
                  ? 'Guardando en la base de datos...'
                  : editandoId
                  ? 'Actualizar Obra'
                  : 'Publicar Obra'}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={resetFormulario}
                  className="py-4 px-6 rounded-lg font-extrabold uppercase tracking-wide"
                  style={{ backgroundColor: C.surfaceLowest, boxShadow: `4px 4px 0 ${C.onSurface}` }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* VISTA PREVIA EN VIVO */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div
            className="p-3 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: '#2f312f', color: '#f1f1ee', boxShadow: `4px 4px 0 ${C.onSurface}` }}
          >
            <span className="font-bold uppercase text-sm">Vista Previa en Portafolio</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer }}
            >
              En Tiempo Real
            </span>
          </div>

          <div
            className="rounded-xl p-5 flex flex-col relative"
            style={{ backgroundColor: C.surfaceLowest, boxShadow: `6px 6px 0 ${C.onSurface}` }}
          >
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
              >
                {categoriaNombre}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, boxShadow: `2px 2px 0 ${C.onSurface}`, transform: 'rotate(-2deg)' }}
              >
                {tipoNombre}
              </span>
            </div>

            <div
              className="w-full aspect-square rounded-lg overflow-hidden relative mb-4 mt-8"
              style={{ backgroundColor: C.surfaceHigh, boxShadow: `3px 3px 0 ${C.onSurface}` }}
            >
              {imagenPreviewUrl ? (
                <img src={imagenPreviewUrl} alt={formData.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: C.onSurfaceVariant }}>
                  Sin imagen aún
                </div>
              )}
              <div
                className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs"
                style={{ backgroundColor: 'rgba(26,28,26,0.85)', color: C.surface }}
              >
                Arte por Daxth1
              </div>
            </div>

            <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight">
              {formData.title || 'Título de la Obra'}
            </h3>
            <p className="text-sm mt-1" style={{ color: C.onSurfaceVariant }}>
              {formData.technique || 'Técnica no especificada'}
              {formData.completion_date ? ` · ${formData.completion_date}` : ''}
            </p>
            <p className="text-sm mt-2 line-clamp-3" style={{ color: C.onSurfaceVariant }}>
              {formData.description || 'Sin descripción aún...'}
            </p>
          </div>
        </div>
      </div>

      {/* GESTIÓN DE OBRAS EXISTENTES */}
      <div
        className="mt-8 rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl">
              Obras Publicadas en el Portafolio
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: C.surfaceHigh }}
            >
              {obras.length}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: C.onSurfaceVariant }}
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título o técnica..."
              className="w-full pl-9 pr-3 py-2 rounded-lg font-medium outline-none text-sm"
              style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
            />
          </div>
        </div>

        {cargandoLista ? (
          <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
            Cargando obras...
          </p>
        ) : obrasFiltradas.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm font-bold uppercase"
            style={{ backgroundColor: C.surfaceLow, color: C.onSurfaceVariant }}
          >
            {obras.length === 0
              ? 'Aún no has publicado ninguna obra.'
              : 'No hay obras que coincidan con tu búsqueda.'}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left border-separate" style={{ borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: C.onSurfaceVariant }}
                >
                  <th className="py-1 px-3">Obra</th>
                  <th className="py-1 px-3 hidden sm:table-cell">Categoría</th>
                  <th className="py-1 px-3 hidden md:table-cell">Técnica</th>
                  <th className="py-1 px-3 hidden md:table-cell">Tipo</th>
                  <th className="py-1 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {obrasFiltradas.map((obra) => (
                  <tr key={obra.id} style={{ backgroundColor: C.surfaceLow }}>
                    <td className="py-2 px-3 rounded-l-lg">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div
                          className="w-11 h-11 rounded overflow-hidden shrink-0"
                          style={{ backgroundColor: C.surfaceHigh, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                        >
                          {obra.primary_image_url ? (
                            <img
                              src={obra.primary_image_url}
                              alt={obra.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{obra.title}</p>
                          {obra.completion_date && (
                            <p className="text-xs" style={{ color: C.onSurfaceVariant }}>
                              {new Date(obra.completion_date).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 hidden sm:table-cell">
                      {obra.category_name && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: C.surfaceHigh }}
                        >
                          {obra.category_name}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell text-sm">
                      {obra.technique || '—'}
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      {obra.project_type && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                          style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                        >
                          {obra.project_type}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 rounded-r-lg">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(obra)}
                          className="p-2 rounded"
                          style={{ backgroundColor: C.surfaceHigh, boxShadow: `1px 1px 0 ${C.onSurface}` }}
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(obra)}
                          disabled={eliminandoId === obra.id}
                          className="p-2 rounded disabled:opacity-50"
                          style={{
                            backgroundColor: C.errorContainer,
                            color: C.onErrorContainer,
                            boxShadow: `1px 1px 0 ${C.onSurface}`,
                          }}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!editandoId && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="self-start inline-flex items-center gap-2 text-xs font-bold uppercase"
            style={{ color: C.primary }}
          >
            <PlusCircle size={14} /> Agregar otra obra
          </button>
        )}
      </div>
    </div>
  );
}