import { useState } from 'react';
import { ArrowLeft, Upload, PackagePlus, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Colores tomados del design system del mockup DaxShop CMS.
// Si tu tailwind.config.js ya define estos tokens (primary, primary-container,
// secondary-container, surface-container-*, etc.) puedes cambiar estos hex por
// esas clases (ej. bg-primary en vez de bg-[#b8004c]). Aquí se usan valores
// arbitrarios para que funcione sin tocar tu configuración.
const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fffbff',
  secondary: '#9d4300',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  onSecondary: '#ffffff',
  surface: '#faf9f6',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  surfaceHighest: '#e3e2e0',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
  outline: '#8e6f74',
};

// Ajusta estos IDs para que coincidan con las categorías reales de tu backend.
const CATEGORIAS = [
  { id: 1, nombre: 'Stickers Vinilo' },
  { id: 2, nombre: 'Prints & Posters' },
  { id: 3, nombre: 'Pines Metálicos' },
  { id: 4, nombre: 'Llaveros Acrílicos' },
  { id: 5, nombre: 'Originales Tradicionales' },
  { id: 6, nombre: 'Streetwear / Tote Bags' },
];

export default function AdminProductos() {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    sku: '',
    titulo: '',
    categoria_id: 1,
    descripcion: '',
    precio_quetzales: '',
    precio_usd: '',
    stock_status: 'Disponible',
    visibility: 'Visible',
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
      // 1. Crear el producto (solo texto)
      const resProducto = await api.post('/productos/admin/crear', {
        ...formData,
        categoria_id: parseInt(formData.categoria_id),
        precio_quetzales: parseFloat(formData.precio_quetzales),
        precio_usd: parseFloat(formData.precio_usd),
      });

      const productoId = resProducto.data.producto_id;

      // 2. Si hay imagen seleccionada, la subimos a Cloudinary
      if (imagen) {
        const formImagen = new FormData();
        formImagen.append('imagen', imagen);
        formImagen.append('is_primary', 'true');

        await api.post(`/productos/admin/${productoId}/imagen`, formImagen);
      }

      setMensaje({ tipo: 'exito', texto: '¡Producto publicado exitosamente con su imagen!' });

      setFormData({
        sku: '',
        titulo: '',
        categoria_id: 1,
        descripcion: '',
        precio_quetzales: '',
        precio_usd: '',
        stock_status: 'Disponible',
        visibility: 'Visible',
      });
      setImagen(null);
      setImagenPreviewUrl(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al guardar el producto.' });
    } finally {
      setCargando(false);
    }
  };

  const categoriaNombre =
    CATEGORIAS.find((c) => c.id === parseInt(formData.categoria_id))?.nombre || 'Categoría';

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
                backgroundColor: C.primaryContainer,
                color: C.onPrimaryContainer,
                boxShadow: `2px 2px 0 ${C.onSurface}`,
              }}
            >
              <PackagePlus size={20} />
            </span>
            <div>
              <h2
                className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight"
              >
                Nuevo Producto
              </h2>
              <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                Sube mercancía al catálogo de DaxShop.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Título del Producto <span style={{ color: C.primary }}>*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Ej: Sticker Holográfico Gato Ninja"
                className="w-full px-4 py-2 rounded font-medium outline-none transition-shadow"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                SKU (Código)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="Ej: STK-001"
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
                name="categoria_id"
                value={formData.categoria_id}
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

            {/* Precios */}
            <div
              className="p-3 rounded-lg flex flex-col gap-1"
              style={{ backgroundColor: C.surfaceLow }}
            >
              <label className="block font-bold text-xs uppercase tracking-wide">
                Precio Local (Quetzales)
              </label>
              <div className="relative flex items-center">
                <span
                  className="absolute left-3 font-extrabold"
                  style={{ color: C.primary }}
                >
                  Q
                </span>
                <input
                  type="number"
                  step="0.01"
                  name="precio_quetzales"
                  value={formData.precio_quetzales}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 pr-4 py-2 rounded font-medium outline-none"
                  style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                />
              </div>
            </div>

            <div
              className="p-3 rounded-lg flex flex-col gap-1"
              style={{ backgroundColor: C.surfaceLow }}
            >
              <label className="block font-bold text-xs uppercase tracking-wide">
                Precio Internacional (USD)
              </label>
              <div className="relative flex items-center">
                <span
                  className="absolute left-3 font-extrabold"
                  style={{ color: C.secondary }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  name="precio_usd"
                  value={formData.precio_usd}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 pr-4 py-2 rounded font-medium outline-none"
                  style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                />
              </div>
            </div>

            {/* Estado / Visibilidad */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Estado de Stock
              </label>
              <select
                name="stock_status"
                value={formData.stock_status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded font-medium outline-none appearance-none cursor-pointer"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              >
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
                <option value="Pre-orden">Pre-orden</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Visibilidad
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded font-medium outline-none appearance-none cursor-pointer"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              >
                <option value="Visible">Visible</option>
                <option value="Oculto">Oculto</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Descripción / Detalle para el fan de IG
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Describe técnica, tamaño, acabado..."
                className="w-full px-4 py-2 rounded font-medium outline-none resize-none"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              />
            </div>

            {/* Imagen */}
            <div className="md:col-span-2">
              <label className="block font-bold text-xs uppercase tracking-wide mb-1">
                Ilustración o Foto del Producto (JPG / PNG / WEBP)
              </label>
              <div
                className="rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
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
                  Recomendado: 1200 x 1200px con contraste marcado cómic.
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
                {cargando ? 'Guardando en la base de datos...' : 'Publicar en Catálogo'}
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
            <span className="font-bold uppercase text-sm">Vista Previa en Tienda Pública</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
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
                className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, boxShadow: `2px 2px 0 ${C.onSurface}`, transform: 'rotate(-2deg)' }}
              >
                {formData.stock_status}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
              >
                {categoriaNombre}
              </span>
            </div>

            <div
              className="absolute top-4 right-4 z-10 px-3 py-1 rounded flex flex-col items-center"
              style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, boxShadow: `3px 3px 0 ${C.onSurface}`, transform: 'rotate(3deg)' }}
            >
              <span className="font-extrabold leading-none">
                Q{formData.precio_quetzales || '0.00'}
              </span>
              <span className="text-xs font-bold uppercase" style={{ color: 'rgba(255,255,255,0.9)' }}>
                ${formData.precio_usd || '0.00'} USD
              </span>
            </div>

            <div
              className="w-full aspect-square rounded-lg overflow-hidden relative mb-4"
              style={{ backgroundColor: C.surfaceHigh, boxShadow: `3px 3px 0 ${C.onSurface}` }}
            >
              {imagenPreviewUrl ? (
                <img src={imagenPreviewUrl} alt={formData.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: C.onSurfaceVariant }}>
                  Sin imagen aún
                </div>
              )}
            </div>

            <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight">
              {formData.titulo || 'Título de la Obra'}
            </h3>
            <p className="text-sm mt-1 line-clamp-2" style={{ color: C.onSurfaceVariant }}>
              {formData.descripcion || 'Sin descripción aún...'}
            </p>

            <div
              className="mt-4 pt-3 p-3 rounded-lg flex flex-col gap-2"
              style={{ backgroundColor: C.surfaceLow }}
            >
              <div className="flex items-center justify-between text-xs font-medium">
                <span>Conversión Directa:</span>
                <span className="font-bold" style={{ color: C.primary }}>Instagram DM</span>
              </div>
              <button
                type="button"
                className="w-full py-3 px-4 rounded-lg font-extrabold uppercase tracking-wide flex items-center justify-center gap-2"
                style={{ backgroundColor: C.primary, color: C.onPrimary, boxShadow: `4px 4px 0 ${C.onSurface}` }}
              >
                <Send size={18} />
                Pedir vía Instagram (@daxth1)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}