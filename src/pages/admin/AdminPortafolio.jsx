import { useState } from 'react';
import { ArrowLeft, Upload, Brush, CheckCircle2 } from 'lucide-react';
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

export default function AdminPortafolio() {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    title: '',
    category_id: 1,
    description: '',
    technique: '',
    completion_date: '',
    project_type: '1',
  });

  const [imagen, setImagen] = useState(null);
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // 1. Crear la obra (texto)
      const resObra = await api.post('/portafolio/admin/crear', {
        ...formData,
        category_id: parseInt(formData.category_id),
      });

      const obraId = resObra.data.obra_id;

      // 2. Subir imagen a Cloudinary
      if (imagen) {
        const formImagen = new FormData();
        formImagen.append('imagen', imagen);
        formImagen.append('is_primary', 'true');

        await api.post(`/portafolio/admin/${obraId}/imagen`, formImagen);
      }

      setMensaje({ tipo: 'exito', texto: '¡Obra publicada exitosamente en el portafolio!' });

      setFormData({
        title: '',
        category_id: 1,
        description: '',
        technique: '',
        completion_date: '',
        project_type: '1',
      });
      setImagen(null);
      setImagenPreviewUrl(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al guardar la obra.' });
    } finally {
      setCargando(false);
    }
  };

  const categoriaNombre =
    CATEGORIAS.find((c) => c.id === parseInt(formData.category_id))?.nombre || 'Categoría';
  const tipoNombre =
    TIPOS_PROYECTO.find((t) => t.value === formData.project_type)?.nombre || 'Personal';

  return (
    <div className="font-['Rubik',sans-serif]" style={{ color: C.onSurface }}>
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
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: C.surfaceLow }}
          >
            <span
              className="w-9 h-9 rounded flex items-center justify-center"
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
                Nueva Obra de Arte
              </h2>
              <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                Sube una pieza al portafolio de Daxth1.
              </p>
            </div>
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
                  Arrastra la imagen o haz clic para subir
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
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-4 rounded-lg font-extrabold uppercase tracking-wide transition-transform hover:-rotate-1 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  boxShadow: `4px 4px 0 ${C.onSurface}`,
                }}
              >
                {cargando ? 'Guardando en la base de datos...' : 'Publicar Obra'}
              </button>
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
    </div>
  );
}