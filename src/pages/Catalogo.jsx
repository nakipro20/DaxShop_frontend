import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Copy,
  Check,
  Search,
  SearchX,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimaryContainer: '#fffbff',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  surface: '#faf9f6',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceContainer: '#efeeeb',
  surfaceHigh: '#e9e8e5',
  surfaceHighest: '#e3e2e0',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
  error: '#ba1a1a',
};

const INSTAGRAM_URL = 'https://instagram.com/daxth1';
const INSTAGRAM_HANDLE = '@daxth1';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [orden, setOrden] = useState('popular');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await api.get('/productos');
        setProductos(respuesta.data.datos || []);
      } catch (err) {
        console.error(err);
        setError('Error al conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const categorias = useMemo(() => {
    const nombres = productos
      .map((p) => p.category_name)
      .filter(Boolean);

    return ['Todos', ...new Set(nombres)];
  }, [productos]);

  const cantidadPorCategoria = useMemo(() => {
    return productos.reduce((acc, producto) => {
      const categoria = producto.category_name || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    let lista = [...productos];

    if (categoriaActiva !== 'Todos') {
      lista = lista.filter(
        (producto) => producto.category_name === categoriaActiva
      );
    }

    const termino = busqueda.trim().toLowerCase();

    if (termino) {
      lista = lista.filter((producto) => {
        const texto = `
          ${producto.title || ''}
          ${producto.description || ''}
          ${producto.sku || ''}
          ${producto.category_name || ''}
        `.toLowerCase();

        return texto.includes(termino);
      });
    }

    if (orden === 'price-asc') {
      lista.sort(
        (a, b) =>
          (Number(a.price_quetzales) || 0) -
          (Number(b.price_quetzales) || 0)
      );
    } else if (orden === 'price-desc') {
      lista.sort(
        (a, b) =>
          (Number(b.price_quetzales) || 0) -
          (Number(a.price_quetzales) || 0)
      );
    } else if (orden === 'name') {
      lista.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );
    }

    return lista;
  }, [productos, categoriaActiva, busqueda, orden]);

  const copiarReferencia = async (producto) => {
    const texto = `${producto.title}${
      producto.sku ? ` (#${producto.sku})` : ''
    } - Q${producto.price_quetzales}`;

    try {
      await navigator.clipboard?.writeText(texto);
    } catch (err) {
      console.error('No fue posible copiar la referencia.', err);
    }

    setToast(texto);

    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const restaurarFiltros = () => {
    setBusqueda('');
    setCategoriaActiva('Todos');
    setOrden('popular');
  };

  if (cargando) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center font-['Rubik',sans-serif]"
        style={{ backgroundColor: C.surface, color: C.onSurface }}
      >
        <div className="text-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-[3px]"
            style={{
              backgroundColor: C.surfaceLowest,
              borderColor: C.onSurface,
              boxShadow: `4px 4px 0 ${C.onSurface}`,
            }}
          >
            <Sparkles size={18} style={{ color: C.primary }} />
            <span className="font-bold uppercase">
              Cargando catálogo...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center px-4 font-['Rubik',sans-serif]"
        style={{ backgroundColor: C.surface }}
      >
        <div
          className="max-w-lg w-full text-center p-8 rounded-2xl border-[3px]"
          style={{
            backgroundColor: C.surfaceLowest,
            borderColor: C.onSurface,
            boxShadow: `5px 5px 0 ${C.onSurface}`,
          }}
        >
          <h2
            className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-extrabold uppercase"
            style={{ color: C.error }}
          >
            No fue posible cargar el catálogo
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: C.onSurfaceVariant }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen font-['Rubik',sans-serif]"
      style={{
        backgroundColor: C.surface,
        color: C.onSurface,
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[60] max-w-[calc(100vw-2rem)] flex items-center gap-3 px-4 py-3 rounded-xl border-[3px]"
          style={{
            backgroundColor: C.surfaceLowest,
            borderColor: C.onSurface,
            boxShadow: `4px 4px 0 ${C.onSurface}`,
          }}
        >
          <div
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: C.primaryContainer,
              color: C.onPrimaryContainer,
            }}
          >
            <Check size={18} />
          </div>

          <div className="flex flex-col min-w-0">
            <span
              className="text-xs sm:text-sm font-bold uppercase"
              style={{ color: C.primary }}
            >
              ¡REFERENCIA COPIADA!
            </span>
            <span
              className="text-xs truncate"
              style={{ color: C.onSurfaceVariant }}
            >
              Pégala en tu chat con {INSTAGRAM_HANDLE}
            </span>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b-[3px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
        style={{
          backgroundColor: C.surfaceLow,
          borderColor: C.onSurface,
        }}
      >
        {/* Halftone background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${C.onSurface} 1.5px, transparent 1.5px)`,
            backgroundSize: '14px 14px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 border-[2.5px] rounded-lg shadow-[3px_3px_0_#1a1c1a] font-bold text-xs sm:text-sm uppercase tracking-wider -rotate-1"
              style={{
                backgroundColor: C.secondaryContainer,
                color: C.onSecondaryContainer,
                borderColor: C.onSurface,
              }}
            >
              <ShoppingBag size={16} />
              STREET ART & MERCH STORE
            </div>

            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 rounded-full shadow-[2px_2px_0_#1a1c1a] text-xs font-semibold uppercase"
              style={{
                backgroundColor: C.surfaceLowest,
                borderColor: C.onSurface,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: C.primaryContainer }}
              />
              STOCK ACTUALIZADO
            </div>
          </div>

          {/* Hero content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2 py-1 rounded border text-[11px] font-bold uppercase"
                  style={{
                    backgroundColor: C.primaryContainer,
                    color: C.onPrimaryContainer,
                    borderColor: C.onSurface,
                  }}
                >
                  Direct-to-Artist
                </span>

                <span
                  className="text-sm"
                  style={{ color: C.onSurfaceVariant }}
                >
                  Comunicación directa. Sin carrito.
                </span>
              </div>

              <h1
                className="font-['Bricolage_Grotesque',sans-serif] font-extrabold uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl"
                style={{ color: C.onSurface }}
              >
                CATÁLOGO &{' '}
                <span
                  className="inline-block px-3 py-2 mt-2 rounded-xl border-[3px] shadow-[4px_4px_0_#1a1c1a] -rotate-1"
                  style={{
                    backgroundColor: C.primaryContainer,
                    color: C.onPrimaryContainer,
                    borderColor: C.onSurface,
                  }}
                >
                  PRECIOS
                </span>
              </h1>

              <p
                className="max-w-2xl text-base sm:text-lg leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                Explora nuestro catálogo de productos, revisa precios y
                encuentra tu próxima pieza favorita. Cuando encuentres algo
                que te guste, puedes pedirlo directamente por Instagram.
              </p>
            </div>

            {/* Comic bubble */}
            <div className="lg:col-span-5 relative">
              <div
                className="absolute -top-5 -right-2 z-20 px-3 py-1 rounded border-[2.5px] shadow-[3px_3px_0_#1a1c1a] font-['Bricolage_Grotesque',sans-serif] font-bold uppercase rotate-6"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  borderColor: C.onSurface,
                }}
              >
                ¡SIN CARRITO!
              </div>

              <div
                className="relative p-5 rounded-2xl border-[3px] shadow-[6px_6px_0_#1a1c1a] flex flex-col gap-3"
                style={{
                  backgroundColor: C.surfaceLowest,
                  borderColor: C.onSurface,
                }}
              >
                <div
                  className="flex items-center gap-2 font-['Bricolage_Grotesque',sans-serif] font-bold text-lg"
                  style={{ color: C.primary }}
                >
                  <MessageCircle size={24} />
                  ¿CÓMO COMPRAR?
                </div>

                <p
                  className="text-sm sm:text-base leading-snug"
                  style={{ color: C.onSurface }}
                >
                  Revisa los productos, pulsa{' '}
                  <strong style={{ color: C.primary }}>
                    “Pedir vía IG”
                  </strong>{' '}
                  o copia la referencia y envíala por mensaje directo a{' '}
                  <strong className="underline">
                    {INSTAGRAM_HANDLE}
                  </strong>
                  .
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[190px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-[2.5px] shadow-[4px_4px_0_#1a1c1a] font-bold text-xs sm:text-sm uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#1a1c1a]"
                    style={{
                      backgroundColor: C.primaryContainer,
                      color: C.onPrimaryContainer,
                      borderColor: C.onSurface,
                    }}
                  >
                    <Send size={17} />
                    Abrir Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      {productos.length > 0 && (
        <section
          className="sticky top-0 z-40 border-b-[3px] py-3 px-4 sm:px-6 lg:px-8 shadow-[0_4px_0_#1a1c1a]"
          style={{
            backgroundColor: C.surfaceContainer,
            borderColor: C.onSurface,
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <span
                className="hidden xl:inline text-xs font-bold uppercase tracking-wider mr-1 shrink-0"
                style={{ color: C.onSurfaceVariant }}
              >
                FORMATO:
              </span>

              {categorias.map((cat) => {
                const cantidad =
                  cat === 'Todos'
                    ? productos.length
                    : cantidadPorCategoria[cat] || 0;

                const activo = categoriaActiva === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaActiva(cat)}
                    className="shrink-0 px-3 py-2 rounded-lg border-2 text-[11px] sm:text-xs font-bold uppercase shadow-[2px_2px_0_#1a1c1a] transition-all hover:-translate-y-0.5"
                    style={{
                      backgroundColor: activo
                        ? C.primaryContainer
                        : C.surfaceLowest,
                      color: activo
                        ? C.onPrimaryContainer
                        : C.onSurface,
                      borderColor: C.onSurface,
                    }}
                  >
                    {cat} ({cantidad})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search
                  size={16}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: C.onSurfaceVariant }}
                />

                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar obra o personaje..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border-2 text-sm outline-none"
                  style={{
                    backgroundColor: C.surfaceLowest,
                    color: C.onSurface,
                    borderColor: C.onSurface,
                  }}
                />
              </div>

              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="px-3 py-2 rounded-lg border-2 text-[11px] sm:text-xs font-bold uppercase outline-none cursor-pointer shadow-[2px_2px_0_#1a1c1a]"
                style={{
                  backgroundColor: C.surfaceLowest,
                  color: C.onSurface,
                  borderColor: C.onSurface,
                }}
              >
                <option value="popular">POPULARES</option>
                <option value="price-asc">MENOR PRECIO</option>
                <option value="price-desc">MAYOR PRECIO</option>
                <option value="name">NOMBRE (A-Z)</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {productos.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border-[3px] font-bold uppercase"
            style={{
              backgroundColor: C.surfaceLow,
              borderColor: C.onSurface,
              boxShadow: `5px 5px 0 ${C.onSurface}`,
            }}
          >
            No hay productos disponibles por el momento.
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div
            className="rounded-2xl p-10 flex flex-col items-center gap-3 text-center border-[3px]"
            style={{
              backgroundColor: C.surfaceLow,
              borderColor: C.onSurface,
              boxShadow: `5px 5px 0 ${C.onSurface}`,
            }}
          >
            <SearchX size={36} style={{ color: C.primary }} />

            <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl uppercase">
              No hay piezas con ese filtro
            </h3>

            <p
              className="text-sm max-w-md"
              style={{ color: C.onSurfaceVariant }}
            >
              Prueba con otra palabra o categoría.
            </p>

            <button
              type="button"
              onClick={restaurarFiltros}
              className="mt-2 px-4 py-2 rounded-lg border-2 text-sm font-bold uppercase shadow-[3px_3px_0_#1a1c1a] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
              style={{
                backgroundColor: C.primaryContainer,
                color: C.onPrimaryContainer,
                borderColor: C.onSurface,
              }}
            >
              Restaurar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <article
                key={producto.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border-[3px] transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: C.surfaceLowest,
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                {/* Image panel */}
                <div
                  className="relative p-2 overflow-hidden border-b-[3px] flex items-center justify-center"
                  style={{
                    backgroundColor: C.surfaceHigh,
                    borderColor: C.onSurface,
                  }}
                >
                  {/* Halftone */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(${C.onSurface} 1px, transparent 1px)`,
                      backgroundSize: '8px 8px',
                    }}
                  />

                  {producto.category_name && (
                    <span
                      className="absolute top-2 left-2 z-10 px-2 py-1 rounded border-2 text-[10px] font-bold uppercase shadow-[1px_1px_0_#1a1c1a]"
                      style={{
                        backgroundColor: C.surfaceLowest,
                        color: C.onSurface,
                        borderColor: C.onSurface,
                      }}
                    >
                      {producto.category_name}
                    </span>
                  )}

                  <div
                    className="absolute bottom-2 right-2 z-10 px-3 py-2 rounded-lg border-2 shadow-[3px_3px_0_#1a1c1a] rotate-2 flex flex-col items-center"
                    style={{
                      backgroundColor: C.secondaryContainer,
                      color: C.onSecondaryContainer,
                      borderColor: C.onSurface,
                    }}
                  >
                    <span className="font-['Bricolage_Grotesque',sans-serif] text-lg font-extrabold leading-none">
                      Q{producto.price_quetzales}
                    </span>

                    {producto.price_usd && (
                      <span className="text-[10px] opacity-90 leading-none mt-0.5">
                        ${producto.price_usd} USD
                      </span>
                    )}
                  </div>

                  {producto.primary_image_url ? (
                    <img
                      src={producto.primary_image_url}
                      alt={producto.title}
                      className="relative z-[1] w-full h-56 object-cover rounded-lg border-2 transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{ borderColor: C.onSurface }}
                    />
                  ) : (
                    <div
                      className="relative z-[1] w-full h-56 flex items-center justify-center rounded-lg border-2 text-xs font-bold uppercase"
                      style={{
                        borderColor: C.onSurface,
                        color: C.onSurfaceVariant,
                        backgroundColor: C.surfaceLowest,
                      }}
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      {producto.sku ? (
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: C.primary }}
                        >
                          CÓDIGO: #{producto.sku}
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>

                    <h2
                      className="font-['Bricolage_Grotesque',sans-serif] font-bold text-lg leading-tight"
                      title={producto.title}
                    >
                      {producto.title}
                    </h2>

                    {producto.description && (
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: C.onSurfaceVariant }}
                      >
                        {producto.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="flex flex-col gap-2 pt-3 border-t"
                    style={{ borderColor: C.surfaceHigh }}
                  >
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg border-2 shadow-[3px_3px_0_#1a1c1a] text-xs sm:text-sm font-bold uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                      style={{
                        backgroundColor: C.primaryContainer,
                        color: C.onPrimaryContainer,
                        borderColor: C.onSurface,
                      }}
                    >
                      <Send size={15} />
                      Pedir vía IG ({INSTAGRAM_HANDLE})
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => copiarReferencia(producto)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 rounded border text-[11px] font-bold uppercase transition-colors"
                        style={{
                          backgroundColor: C.surfaceLow,
                          color: C.onSurface,
                          borderColor: C.onSurface,
                        }}
                      >
                        <Copy size={14} />
                        Copiar SKU
                      </button>

                      <Link
                        to={`/catalogo/${producto.id}`}
                        className="inline-flex items-center justify-center py-2 rounded border text-[11px] font-bold uppercase transition-colors"
                        style={{
                          backgroundColor: C.onSurface,
                          color: C.surfaceLowest,
                          borderColor: C.onSurface,
                        }}
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
