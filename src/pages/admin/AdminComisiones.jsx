import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Palette,
  Trash2,
  Upload,
  CheckCircle2,
  Clock,
  Send,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Colores tomados del design system del mockup DaxShop CMS.
const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fffbff',
  secondary: '#9d4300',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
};

// Estos campos corresponden 1 a 1 con sp_insert_commission_type(type_name,
// price_quetzales, price_usd, description, estimated_time, cover_image_url).
const FORM_INICIAL = {
  type_name: '',
  price_quetzales: '',
  price_usd: '',
  description: '',
  estimated_time: '',
};

export default function AdminComisiones() {
  const [comisiones, setComisiones] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [busqueda, setBusqueda] = useState('');

  const [imagen, setImagen] = useState(null);
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState(null);

  const cargarComisiones = async () => {
    setCargandoLista(true);
    try {
      const respuesta = await api.get('/comisiones');
      setComisiones(respuesta.data.datos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    cargarComisiones();
  }, []);

  // Normaliza por si sp_get_commission_types() todavía no fue actualizada
  // para devolver las columnas nuevas, o si en algún punto se usa un nombre
  // distinto (name/base_price_quetzales) — así la tabla no se queda en
  // blanco silenciosamente mientras se corrige el backend.
  const normalizar = (c) => ({
    ...c,
    type_name: c.type_name || c.name || 'Comisión',
    price_quetzales: c.price_quetzales ?? c.base_price_quetzales ?? 0,
    price_usd: c.price_usd ?? c.base_price_usd ?? 0,
    cover_image_url: c.cover_image_url || c.image_url || null,
  });

  const comisionesFiltradas = useMemo(() => {
    const lista = comisiones.map(normalizar);
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return lista;
    return lista.filter((c) =>
      `${c.type_name || ''} ${c.description || ''}`.toLowerCase().includes(termino)
    );
  }, [comisiones, busqueda]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // 1. Crear el tipo de comisión (solo texto). El SP recibe cover_image_url
      //    directo en la creación, pero aquí la subimos en un segundo paso —
      //    igual que Productos y Portafolio — para poder usar un <input type="file">
      //    real en vez de pedirle al usuario una URL ya alojada.
      const resComision = await api.post('/comisiones/admin/crear', {
        ...formData,
        price_quetzales: parseFloat(formData.price_quetzales),
        price_usd: parseFloat(formData.price_usd),
        estimated_time: formData.estimated_time || null,
      });

      // El controlador responde con "comision_id" (ver cmsComisionesController.js).
      const comisionId = resComision.data.comision_id ?? resComision.data.tipo_id;

      // 2. Si hay imagen seleccionada, la subimos.
      // Asume un endpoint POST /comisiones/admin/:id/imagen, igual al patrón
      // que ya usan /productos/admin/:id/imagen y /portafolio/admin/:id/imagen.
      // Si no existe todavía, hay que crearlo (o guardar cover_image_url
      // directo en /comisiones/admin/crear si prefieres subir antes de crear).
      if (imagen && comisionId) {
        const formImagen = new FormData();
        formImagen.append('imagen', imagen);

        await api.post(`/comisiones/admin/${comisionId}/imagen`, formImagen);
      }

      setMensaje({ tipo: 'exito', texto: '¡Tipo de comisión creado exitosamente!' });
      resetFormulario();
      cargarComisiones();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al guardar el tipo de comisión.' });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    const confirmado = window.confirm('¿Eliminar este tipo de comisión? Esta acción no se puede deshacer.');
    if (!confirmado) return;

    try {
      await api.delete(`/comisiones/admin/eliminar/${id}`);
      setComisiones((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar el tipo de comisión.' });
    }
  };

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
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: C.surfaceLow }}
          >
            <span
              className="w-9 h-9 rounded flex items-center justify-center"
              style={{
                backgroundColor: C.primaryContainer,
                color: C.onPrimaryContainer,
                boxShadow: `2px 2px 0 ${C.onSurface}`,
              }}
            >
              <Palette size={20} />
            </span>
            <div>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight">
                Nuevo Tipo de Comisión
              </h2>
              <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                Define qué tipos de encargos aceptas y su precio base.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Nombre del Tipo <span style={{ color: C.primary }}>*</span>
              </label>
              <input
                type="text"
                name="type_name"
                value={formData.type_name}
                onChange={handleChange}
                required
                placeholder="Ej: Retrato estilo anime, Diseño de personaje..."
                className="w-full px-4 py-2 rounded font-medium outline-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            <div className="p-3 rounded-lg flex flex-col gap-1" style={{ backgroundColor: C.surfaceLow }}>
              <label className="block font-bold text-xs uppercase tracking-wide">Precio (GTQ)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-extrabold" style={{ color: C.primary }}>Q</span>
                <input
                  type="number"
                  step="0.01"
                  name="price_quetzales"
                  value={formData.price_quetzales}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 pr-4 py-2 rounded font-medium outline-none"
                  style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg flex flex-col gap-1" style={{ backgroundColor: C.surfaceLow }}>
              <label className="block font-bold text-xs uppercase tracking-wide">Precio (USD)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-extrabold" style={{ color: C.secondary }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  name="price_usd"
                  value={formData.price_usd}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 pr-4 py-2 rounded font-medium outline-none"
                  style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide mb-1">
                <Clock size={13} /> Tiempo Estimado de Entrega
              </label>
              <input
                type="text"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleChange}
                placeholder="Ej: 5 a 10 días"
                className="w-full px-4 py-2 rounded font-medium outline-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Qué incluye, tiempos de entrega, revisiones..."
                className="w-full px-4 py-2 rounded font-medium outline-none resize-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* Imagen — subida real de archivo, igual que Productos/Portafolio */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Imagen de Referencia (JPG / PNG / WEBP)
              </label>
              <div
                className="rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer"
                style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: '#ffd9de', color: '#3f0015', boxShadow: `2px 2px 0 ${C.onSurface}` }}
                >
                  <Upload size={22} />
                </div>
                <label className="font-bold cursor-pointer">
                  Arrastra la imagen o haz clic para subir
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-xs mt-1" style={{ color: C.onSurfaceVariant }}>
                  Ej: ejemplo de acabado, pieza de referencia del estilo.
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
                {cargando ? 'Guardando en la base de datos...' : 'Agregar Tipo de Comisión'}
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
            <span className="font-bold uppercase text-sm">Vista Previa en Comisiones</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
            >
              En Tiempo Real
            </span>
          </div>

          <div
            className="rounded-xl overflow-hidden flex flex-col"
            style={{ backgroundColor: C.surfaceLowest, boxShadow: `6px 6px 0 ${C.onSurface}` }}
          >
            <div
              className="relative h-44"
              style={{ backgroundColor: C.surfaceHigh }}
            >
              {imagenPreviewUrl ? (
                <img src={imagenPreviewUrl} alt={formData.type_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                  Sin imagen aún
                </div>
              )}
              {formData.estimated_time && (
                <span
                  className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                >
                  {formData.estimated_time}
                </span>
              )}
            </div>

            <div className="p-5 flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase" style={{ color: C.primary }}>
                Tipo de comisión
              </span>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight">
                {formData.type_name || 'Nombre de la comisión'}
              </h3>
              <p className="text-sm line-clamp-2" style={{ color: C.onSurfaceVariant }}>
                {formData.description || 'Sin descripción aún...'}
              </p>

              <div
                className="my-2 p-3 rounded-lg"
                style={{ backgroundColor: C.surfaceLow }}
              >
                <span className="text-xs font-bold uppercase block" style={{ color: C.onSurfaceVariant }}>
                  Precio Base
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl" style={{ color: C.primary }}>
                    Q{formData.price_quetzales || '0.00'}
                  </span>
                  <span className="text-sm font-bold" style={{ color: C.onSurfaceVariant }}>
                    (${formData.price_usd || '0.00'} USD)
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 px-4 rounded-lg font-extrabold uppercase tracking-wide flex items-center justify-center gap-2"
                style={{ backgroundColor: C.primary, color: C.onPrimary, boxShadow: `4px 4px 0 ${C.onSurface}` }}
              >
                <Send size={18} />
                Cotizar este estilo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE COMISIONES EXISTENTES — abajo del formulario */}
      <div
        className="mt-8 rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl">
              Tipos de Comisión Activos
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: C.surfaceHigh }}
            >
              {comisiones.length}
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
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-3 py-2 rounded-lg font-medium outline-none text-sm"
              style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
            />
          </div>
        </div>

        {cargandoLista ? (
          <p className="text-sm" style={{ color: C.onSurfaceVariant }}>Cargando...</p>
        ) : comisionesFiltradas.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm font-bold uppercase"
            style={{ backgroundColor: C.surfaceLow, color: C.onSurfaceVariant }}
          >
            {comisiones.length === 0
              ? 'Aún no has creado ningún tipo de comisión.'
              : 'No hay tipos de comisión que coincidan con tu búsqueda.'}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left border-separate" style={{ borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: C.onSurfaceVariant }}
                >
                  <th className="py-1 px-3">Comisión</th>
                  <th className="py-1 px-3 hidden md:table-cell">Tiempo estimado</th>
                  <th className="py-1 px-3">Precio</th>
                  <th className="py-1 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comisionesFiltradas.map((c) => (
                  <tr key={c.id} style={{ backgroundColor: C.surfaceLow }}>
                    <td className="py-2 px-3 rounded-l-lg">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div
                          className="w-11 h-11 rounded overflow-hidden shrink-0"
                          style={{ backgroundColor: C.surfaceHigh, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                        >
                          {c.cover_image_url ? (
                            <img src={c.cover_image_url} alt={c.type_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{c.type_name}</p>
                          {c.description && (
                            <p className="text-xs truncate" style={{ color: C.onSurfaceVariant }}>
                              {c.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      {c.estimated_time && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer }}
                        >
                          <Clock size={11} /> {c.estimated_time}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-extrabold" style={{ color: C.primary }}>
                        Q{c.price_quetzales}
                      </span>
                      {c.price_usd && (
                        <span className="text-xs ml-1" style={{ color: C.onSurfaceVariant }}>
                          / ${c.price_usd}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 rounded-r-lg">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleEliminar(c.id)}
                          className="p-2 rounded"
                          style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, boxShadow: `1px 1px 0 ${C.onSurface}` }}
                          title="Eliminar tipo de comisión"
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
      </div>
    </div>
  );
}