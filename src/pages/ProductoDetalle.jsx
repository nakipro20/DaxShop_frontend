import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Tag,
  Package,
} from 'lucide-react';
import api from '../services/api';

const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimaryContainer: '#fffbff',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  cream: '#fff9ef',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
};

const INSTAGRAM_URL = 'https://instagram.com/daxth1';
const INSTAGRAM_HANDLE = '@daxth1';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        const respuesta = await api.get(`/productos/${id}`);
        setProducto(respuesta.data.datos);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el producto o no existe.');
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalles();
  }, [id]);

    console.log(producto)


  const copiarReferencia = () => {
    if (!producto) return;

    const texto = `${producto.title}${
      producto.sku ? ` (#${producto.sku})` : ''
    } - Q${producto.price_quetzales}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).catch(() => {});
    }

    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (cargando) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center px-6"
        style={{ backgroundColor: C.cream }}
      >
        <div
          className="px-8 py-6 border-4 rounded-xl font-black uppercase text-xl"
          style={{
            color: C.onSurface,
            backgroundColor: C.secondaryContainer,
            borderColor: C.onSurface,
            boxShadow: `7px 7px 0 ${C.onSurface}`,
          }}
        >
          Cargando producto...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center px-6"
        style={{ backgroundColor: C.cream }}
      >
        <div
          className="max-w-lg text-center px-8 py-8 border-4 rounded-xl"
          style={{
            color: C.onSurface,
            backgroundColor: C.surfaceLowest,
            borderColor: C.onSurface,
            boxShadow: `8px 8px 0 ${C.primary}`,
          }}
        >
          <h2 className="font-['Bricolage_Grotesque',sans-serif] font-black uppercase text-3xl mb-3">
            Producto no encontrado
          </h2>
          <p className="font-bold mb-6" style={{ color: C.onSurfaceVariant }}>
            {error}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 border-4 rounded-lg font-black uppercase"
            style={{
              backgroundColor: C.primary,
              color: '#fff',
              borderColor: C.onSurface,
              boxShadow: `4px 4px 0 ${C.onSurface}`,
            }}
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  const stock = producto.stock_status || 'Consultar disponibilidad';

  return (
    <main
      className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundColor: C.cream,
        color: C.onSurface,
        backgroundImage: `
          radial-gradient(${C.onSurface} 1px, transparent 1px),
          radial-gradient(${C.primary} 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px, 42px 42px',
        backgroundPosition: '0 0, 14px 14px',
        backgroundBlendMode: 'soft-light',
      }}
    >
      {/* Decoración del fondo */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{
          backgroundColor: C.primaryContainer,
          border: `4px solid ${C.onSurface}`,
        }}
      />

      <div
        className="absolute bottom-10 -left-24 w-56 h-56 rotate-12 opacity-15 pointer-events-none"
        style={{
          backgroundColor: C.secondaryContainer,
          border: `4px solid ${C.onSurface}`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex self-start items-center gap-2 px-4 py-3 border-4 rounded-lg font-black uppercase text-sm transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: C.surfaceLowest,
              borderColor: C.onSurface,
              boxShadow: `4px 4px 0 ${C.onSurface}`,
            }}
          >
            <ArrowLeft size={18} />
            Volver al catálogo
          </button>

          <div
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 border-4 rounded-full font-black uppercase text-xs rotate-1"
            style={{
              backgroundColor: C.primary,
              color: '#fff',
              borderColor: C.onSurface,
              boxShadow: `3px 3px 0 ${C.onSurface}`,
            }}
          >
            <Sparkles size={15} />
            Street Art & Merch Store
          </div>
        </div>

        {/* Título de sección */}
        <section className="mb-8 md:mb-10">
          <div
            className="inline-block px-3 py-1 mb-3 border-4 rounded-md font-black uppercase text-xs -rotate-1"
            style={{
              backgroundColor: C.secondaryContainer,
              color: C.onSecondaryContainer,
              borderColor: C.onSurface,
              boxShadow: `3px 3px 0 ${C.onSurface}`,
            }}
          >
            Ficha del producto
          </div>

          <h1
            className="font-['Bricolage_Grotesque',sans-serif] font-black uppercase leading-[0.9] tracking-tight text-5xl sm:text-6xl lg:text-8xl"
            style={{ maxWidth: '900px' }}
          >
            PRODUCTO
            <span style={{ color: C.primary }}> & DETALLES</span>
          </h1>

          <p
            className="mt-5 max-w-2xl text-base md:text-lg font-bold"
            style={{ color: C.onSurfaceVariant }}
          >
            Conoce todos los detalles, precio y disponibilidad. Para comprar,
            escríbenos directamente por Instagram.
          </p>
        </section>

        {/* Producto */}
        <section
          className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-12 items-start"
        >
          {/* Imagen */}
          <div className="relative">
            {producto.category_name && (
              <div
                className="absolute -top-4 -left-2 md:-left-5 z-20 px-4 py-2 border-4 rounded-md font-black uppercase text-xs md:text-sm -rotate-3"
                style={{
                  backgroundColor: C.primaryContainer,
                  color: '#fff',
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                <span className="inline-flex items-center gap-1">
                  <Tag size={15} />
                  {producto.category_name}
                </span>
              </div>
            )}

            <div
              className="relative overflow-hidden border-4 rounded-2xl"
              style={{
                backgroundColor: C.surfaceLowest,
                borderColor: C.onSurface,
                boxShadow: `10px 10px 0 ${C.onSurface}`,
              }}
            >
              {/* Sticker de precio */}
              <div
                className="absolute z-20 top-5 right-5 w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center text-center border-4 rotate-6"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                <span className="font-black text-xs uppercase">Precio</span>
                <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-3xl md:text-4xl leading-none">
                  Q{producto.price_quetzales}
                </span>
              </div>

              <div
                className="aspect-square flex items-center justify-center p-3 md:p-5"
                style={{
                  backgroundColor: C.surfaceHigh,
                  backgroundImage: `
                    radial-gradient(${C.onSurface} 1px, transparent 1px)
                  `,
                  backgroundSize: '12px 12px',
                }}
              >
                {producto.primary_image_url ? (
                  <img
                    src={producto.primary_image_url}
                    alt={producto.title}
                    className="w-full h-full object-cover border-4 rounded-xl"
                    style={{
                      borderColor: C.onSurface,
                      boxShadow: `5px 5px 0 ${C.primary}`,
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <Package
                      size={64}
                      strokeWidth={2.5}
                      style={{ color: C.onSurfaceVariant }}
                      className="mx-auto mb-3"
                    />
                    <span
                      className="font-black uppercase"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      Sin imagen
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="px-3 py-1 border-2 rounded-full font-black uppercase text-xs"
                style={{
                  backgroundColor: C.surfaceLowest,
                  borderColor: C.onSurface,
                }}
              >
                {producto.category_name || 'Sin categoría'}
              </span>

              {producto.sku && (
                <span
                  className="px-3 py-1 border-2 rounded-full font-black uppercase text-xs"
                  style={{
                    backgroundColor: C.surfaceLow,
                    borderColor: C.onSurface,
                  }}
                >
                  SKU: {producto.sku}
                </span>
              )}
            </div>

            <h2
              className="font-['Bricolage_Grotesque',sans-serif] font-black uppercase leading-[0.9] tracking-tight text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              {producto.title}
            </h2>

            {/* Precio */}
            <div
              className="self-start inline-flex flex-wrap items-baseline gap-3 px-5 py-3 mb-7 border-4 rounded-lg -rotate-1"
              style={{
                backgroundColor: C.secondaryContainer,
                color: C.onSecondaryContainer,
                borderColor: C.onSurface,
                boxShadow: `5px 5px 0 ${C.onSurface}`,
              }}
            >
              <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-4xl md:text-5xl">
                Q{producto.price_quetzales}
              </span>

              {producto.price_usd && (
                <span className="font-black text-sm">
                  (${producto.price_usd} USD)
                </span>
              )}
            </div>

            {/* Descripción */}
            <div
              className="relative p-5 md:p-6 mb-6 border-4 rounded-xl"
              style={{
                backgroundColor: C.surfaceLowest,
                borderColor: C.onSurface,
                boxShadow: `6px 6px 0 ${C.primary}`,
              }}
            >
              <div
                className="absolute -top-4 left-5 px-3 py-1 border-3 rounded-md font-black uppercase text-xs"
                style={{
                  backgroundColor: C.primary,
                  color: '#fff',
                  border: `3px solid ${C.onSurface}`,
                }}
              >
                Descripción
              </div>

              <p
                className="whitespace-pre-line pt-2 leading-relaxed font-medium"
                style={{ color: C.onSurfaceVariant }}
              >
                {producto.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {/* Disponibilidad */}
            <div
              className="flex items-center justify-between gap-4 px-5 py-4 mb-6 border-4 rounded-lg"
              style={{
                backgroundColor: C.surfaceLow,
                borderColor: C.onSurface,
                boxShadow: `4px 4px 0 ${C.onSurface}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Package size={22} />
                <span className="font-black uppercase text-sm">
                  Disponibilidad
                </span>
              </div>

              <span
                className="px-3 py-1 border-2 rounded-md font-black uppercase text-xs"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  borderColor: C.onSurface,
                }}
              >
                {stock}
              </span>
            </div>

            {/* Acciones */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-5 py-4 border-4 rounded-lg font-black uppercase tracking-wide transition-transform hover:-translate-y-1 hover:-rotate-1"
                style={{
                  backgroundColor: C.primary,
                  color: '#fff',
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                <Send size={21} />
                Pedir vía IG
              </a>

              <button
                type="button"
                onClick={copiarReferencia}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 border-4 rounded-lg font-black uppercase text-sm transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: C.surfaceLowest,
                  color: C.onSurface,
                  borderColor: C.onSurface,
                  boxShadow: `4px 4px 0 ${C.onSurface}`,
                }}
              >
                {copiado ? <Check size={18} /> : <Copy size={18} />}
                {copiado ? 'Copiado' : 'Copiar SKU'}
              </button>
            </div>

            {/* Nota estilo mockup */}
            <div
              className="mt-6 p-5 border-4 rounded-xl rotate-1"
              style={{
                backgroundColor: '#fff',
                borderColor: C.onSurface,
                boxShadow: `5px 5px 0 ${C.secondaryContainer}`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 p-2 border-2 rounded-full"
                  style={{
                    backgroundColor: C.secondaryContainer,
                    borderColor: C.onSurface,
                  }}
                >
                  <MessageCircle size={19} />
                </div>

                <div>
                  <p className="font-black uppercase text-sm mb-1">
                    Compra directa al artista
                  </p>
                  <p
                    className="text-sm font-medium leading-relaxed"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    No usamos carrito. Escríbenos por Instagram indicando el
                    producto y su SKU para coordinar tu pedido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
