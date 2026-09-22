import { useState, useEffect } from 'react';
import { ArrowLeft, Palette, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Colores tomados del design system del mockup DaxShop CMS.
// Si tu tailwind.config.js ya define estos tokens, puedes cambiar estos hex por clases.
const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fffbff',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
};

const FORM_INICIAL = {
  type_name: '',
  price_quetzales: '',
  price_usd: '',
  description: '',
};

export default function AdminComisiones() {
  const [comisiones, setComisiones] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [formData, setFormData] = useState(FORM_INICIAL);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      await api.post('/comisiones/admin/crear', {
        ...formData,
        price_quetzales: parseFloat(formData.price_quetzales),
        price_usd: parseFloat(formData.price_usd),
      });

      setMensaje({ tipo: 'exito', texto: '¡Tipo de comisión creado exitosamente!' });
      setFormData(FORM_INICIAL);
      cargarComisiones();
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al guardar el tipo de comisión.' });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/comisiones/admin/eliminar/${id}`);
      setComisiones((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar el tipo de comisión.' });
    }
  };

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
          className="xl:col-span-5 rounded-xl p-6 flex flex-col gap-5"
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
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

            <div className="grid grid-cols-2 gap-4">
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
                  <span className="absolute left-3 font-extrabold" style={{ color: '#9d4300' }}>$</span>
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
            </div>

            <div>
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

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-4 rounded-lg font-extrabold uppercase tracking-wide transition-transform hover:-rotate-1 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                backgroundColor: C.secondaryContainer,
                color: C.onSecondaryContainer,
                boxShadow: `4px 4px 0 ${C.onSurface}`,
              }}
            >
              <Plus size={18} />
              {cargando ? 'Guardando...' : 'Agregar Tipo de Comisión'}
            </button>
          </form>
        </div>

        {/* LISTA DE COMISIONES ACTUALES */}
        <div
          className="xl:col-span-7 rounded-xl p-6 flex flex-col gap-4"
          style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
        >
          <div className="flex items-center justify-between">
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

          {cargandoLista ? (
            <p className="text-sm" style={{ color: C.onSurfaceVariant }}>Cargando...</p>
          ) : comisiones.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center text-sm font-bold uppercase"
              style={{ backgroundColor: C.surfaceLow, color: C.onSurfaceVariant }}
            >
              Aún no has creado ningún tipo de comisión.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {comisiones.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 p-4 rounded-lg"
                  style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                >
                  <div className="min-w-0">
                    <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-base truncate">
                      {c.type_name}
                    </h3>
                    {c.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: C.onSurfaceVariant }}>
                        {c.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-extrabold block" style={{ color: C.primary }}>
                        Q{c.price_quetzales}
                      </span>
                      {c.price_usd && (
                        <span className="text-xs" style={{ color: C.onSurfaceVariant }}>
                          ${c.price_usd} USD
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminar(c.id)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: '#ffdad6', color: '#93000a', boxShadow: `2px 2px 0 ${C.onSurface}` }}
                      title="Eliminar tipo de comisión"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}