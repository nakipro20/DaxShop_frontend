import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Upload,
  PackagePlus,
  Send,
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
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
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

const FORM_INICIAL = {
  sku: '',
  titulo: '',
  categoria_id: 1,
  descripcion: '',
  precio_quetzales: '',
  precio_usd: '',
  stock_status: 'Disponible',
  visibility: 'Visible',
};

export default function AdminProductos() {
  // --- Alta / edición ---
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [imagen, setImagen] = useState(null);
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  // --- Listado / gestión ---
  const [productos, setProductos] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [eliminandoId, setEliminandoId] = useState(null);

  const cargarProductos = async () => {
    setCargandoLista(true);
    try {
      // Usa el listado ADMIN (incluye ocultos y trae "visibility"),
      // no el público (/productos), que no devuelve ese campo.
      const respuesta = await api.get('/productos/admin/listado');
      setProductos(respuesta.data.datos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return productos;

    return productos.filter((p) => {
      const texto = `${p.title || ''} ${p.sku || ''} ${p.category_name || ''}`.toLowerCase();
      return texto.includes(termino);
    });
  }, [productos, busqueda]);

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

  // Precarga el formulario con los datos de un producto existente para editarlo.
  const iniciarEdicion = (producto) => {
    const categoriaCoincidente = CATEGORIAS.find((c) => c.nombre === producto.category_name);

    setEditandoId(producto.id);
    setFormData({
      sku: producto.sku || '',
      titulo: producto.title || '',
      categoria_id: categoriaCoincidente ? categoriaCoincidente.id : 1,
      descripcion: producto.description || '',
      precio_quetzales: producto.price_quetzales ?? '',
      precio_usd: producto.price_usd ?? '',
      stock_status: producto.stock_status || 'Disponible',
      // Ahora sí viene real desde /admin/listado (antes siempre caía en este fallback)
      visibility: producto.visibility || 'Visible',
    });
    setImagen(null);
    setImagenPreviewUrl(producto.primary_image_url || null);
    setMensaje({ tipo: '', texto: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const categoria_id = parseInt(formData.categoria_id);
    const precio_quetzales = parseFloat(formData.precio_quetzales);
    const precio_usd = parseFloat(formData.precio_usd);

    try {
      let productoId = editandoId;

      if (editandoId) {
        // sp_update_product (llamado por CmsProductoModel.actualizarProducto)
        // SOLO actualiza sku/title/category_id/description/precios — NO toca
        // stock_status ni visibility. Por eso van en una llamada aparte a
        // /estado (sp_update_product_status), o nunca se guardaban.
        await api.put(`/productos/admin/actualizar/${editandoId}`, {
          sku: formData.sku,
          titulo: formData.titulo,
          categoria_id,
          descripcion: formData.descripcion,
          precio_quetzales,
          precio_usd,
        });

        await api.patch(`/productos/admin/${editandoId}/estado`, {
          stock_status: formData.stock_status,
          visibility: formData.visibility,
        });
      } else {
        // Crear producto nuevo (sp_insert_product sí acepta stock_status/visibility)
        const resProducto = await api.post('/productos/admin/crear', {
          ...formData,
          categoria_id,
          precio_quetzales,
          precio_usd,
        });
        productoId = resProducto.data.producto_id;
      }

      // Si hay una imagen nueva seleccionada, la subimos (alta o reemplazo).
      if (imagen) {
        const formImagen = new FormData();
        formImagen.append('imagen', imagen);
        formImagen.append('is_primary', 'true');

        await api.post(`/productos/admin/${productoId}/imagen`, formImagen);
      }

      setMensaje({
        tipo: 'exito',
        texto: editandoId
          ? '¡Producto actualizado exitosamente!'
          : '¡Producto publicado exitosamente con su imagen!',
      });

      resetFormulario();
      cargarProductos();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al guardar el producto.' });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (producto) => {
    const confirmado = window.confirm(`¿Eliminar "${producto.title}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    setEliminandoId(producto.id);
    try {
      await api.delete(`/productos/admin/eliminar/${producto.id}`);
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));

      if (editandoId === producto.id) {
        resetFormulario();
      }
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar el producto.' });
    } finally {
      setEliminandoId(null);
    }
  };

  const categoriaNombre =
    CATEGORIAS.find((c) => c.id === parseInt(formData.categoria_id))?.nombre || 'Categoría';

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
                  backgroundColor: C.primaryContainer,
                  color: C.onPrimaryContainer,
                  boxShadow: `2px 2px 0 ${C.onSurface}`,
                }}
              >
                <PackagePlus size={20} />
              </span>
              <div>
                <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl leading-tight">
                  {editandoId ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  {editandoId
                    ? `Editando producto #${editandoId}`
                    : 'Sube mercancía al catálogo de DaxShop.'}
                </p>
              </div>
            </div>

            {editandoId && (
              <button
                type="button"
                onClick={resetFormulario}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase shrink-0"
                style={{
                  backgroundColor: C.surfaceLowest,
                  boxShadow: `2px 2px 0 ${C.onSurface}`,
                }}
              >
                <X size={14} /> Cancelar
              </button>
            )}
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
                  {editandoId ? 'Reemplazar imagen (opcional)' : 'Arrastra la imagen o haz clic para subir'}
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
                  ? 'Actualizar Producto'
                  : 'Publicar en Catálogo'}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={resetFormulario}
                  className="py-4 px-6 rounded-lg font-extrabold uppercase tracking-wide"
                  style={{
                    backgroundColor: C.surfaceLowest,
                    boxShadow: `4px 4px 0 ${C.onSurface}`,
                  }}
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

      {/* GESTIÓN DE PRODUCTOS EXISTENTES */}
      <div
        className="mt-8 rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl">
              Inventario Activo en Tienda
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: C.surfaceHigh }}
            >
              {productos.length}
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
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-lg font-medium outline-none text-sm"
              style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
            />
          </div>
        </div>

        {cargandoLista ? (
          <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
            Cargando productos...
          </p>
        ) : productosFiltrados.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm font-bold uppercase"
            style={{ backgroundColor: C.surfaceLow, color: C.onSurfaceVariant }}
          >
            {productos.length === 0
              ? 'Aún no has publicado ningún producto.'
              : 'No hay productos que coincidan con tu búsqueda.'}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left border-separate" style={{ borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: C.onSurfaceVariant }}
                >
                  <th className="py-1 px-3">Producto</th>
                  <th className="py-1 px-3 hidden sm:table-cell">Categoría</th>
                  <th className="py-1 px-3">Precio</th>
                  <th className="py-1 px-3 hidden md:table-cell">Estado</th>
                  <th className="py-1 px-3 hidden md:table-cell">Visibilidad</th>
                  <th className="py-1 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr
                    key={producto.id}
                    style={{ backgroundColor: C.surfaceLow }}
                  >
                    <td className="py-2 px-3 rounded-l-lg">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div
                          className="w-11 h-11 rounded overflow-hidden shrink-0"
                          style={{ backgroundColor: C.surfaceHigh, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                        >
                          {producto.primary_image_url ? (
                            <img
                              src={producto.primary_image_url}
                              alt={producto.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{producto.title}</p>
                          {producto.sku && (
                            <p className="text-xs" style={{ color: C.onSurfaceVariant }}>
                              SKU: {producto.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 hidden sm:table-cell">
                      {producto.category_name && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: C.surfaceHigh }}
                        >
                          {producto.category_name}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-extrabold" style={{ color: C.primary }}>
                        Q{producto.price_quetzales}
                      </span>
                      {producto.price_usd && (
                        <span className="text-xs ml-1" style={{ color: C.onSurfaceVariant }}>
                          / ${producto.price_usd}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer }}
                      >
                        {producto.stock_status || 'Disponible'}
                      </span>
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      <span
                        className="text-xs font-bold"
                        style={{ color: producto.visibility === 'Oculto' ? C.onSurfaceVariant : C.primary }}
                      >
                        {producto.visibility || 'Visible'}
                      </span>
                    </td>
                    <td className="py-2 px-3 rounded-r-lg">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(producto)}
                          className="p-2 rounded"
                          style={{ backgroundColor: C.surfaceHigh, boxShadow: `1px 1px 0 ${C.onSurface}` }}
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(producto)}
                          disabled={eliminandoId === producto.id}
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
            <PlusCircle size={14} /> Agregar otro producto
          </button>
        )}
      </div>
    </div>
  );
}