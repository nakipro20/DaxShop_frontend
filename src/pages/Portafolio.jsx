import { useState, useEffect, useMemo } from 'react';
import {
  Send,
  X,
  Palette,
  Search,
  SearchX,
  MessageCircle,
  Sparkles,
  Brush,
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

// Contenido de la artista/estudio — ajusta estos textos si cambian.
const ARTISTA = {
  nombreArtistico: 'DAX',
  nombreCompleto: 'Jenifer Yasmin Rodas Castañeda',
  bio: 'Exploración de narrativa visual, viñetas callejeras, leyendas guatemaltecas y fanarts icónicos. Fusión de técnicas tradicionales al acrílico/óleo con ilustración pop cómic y zines autopublicados.',
  cita: 'El arte callejero y la viñeta cómic son la voz pura de la juventud y el color sin censura.',
  ubicacion: 'Guatemala · Universidad de San Carlos',
};

export default function Portafolio() {
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [orden, setOrden] = useState('reciente');
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerObras = async () => {
      try {
        const respuesta = await api.get('/portafolio');
        setObras(respuesta.data.datos || []);
      } catch (err) {
        console.error(err);
        setError('Error al conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    obtenerObras();
  }, []);

  const categorias = useMemo(() => {
    const nombres = obras.map((o) => o.category_name).filter(Boolean);
    return ['Todos', ...new Set(nombres)];
  }, [obras]);

  const cantidadPorCategoria = useMemo(() => {
    return obras.reduce((acc, obra) => {
      const categoria = obra.category_name || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});
  }, [obras]);

  const obrasFiltradas = useMemo(() => {
    let lista = [...obras];

    if (categoriaActiva !== 'Todos') {
      lista = lista.filter((obra) => obra.category_name === categoriaActiva);
    }

    const termino = busqueda.trim().toLowerCase();

    if (termino) {
      lista = lista.filter((obra) => {
        const texto = `
          ${obra.title || ''}
          ${obra.description || ''}
          ${obra.technique || ''}
          ${obra.category_name || ''}
        `.toLowerCase();

        return texto.includes(termino);
      });
    }

    if (orden === 'name') {
      lista.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (orden === 'antiguo') {
      lista.sort(
        (a, b) => new Date(a.completion_date || 0) - new Date(b.completion_date || 0)
      );
    } else if (orden === 'reciente') {
      lista.sort(
        (a, b) => new Date(b.completion_date || 0) - new Date(a.completion_date || 0)
      );
    }

    return lista;
  }, [obras, categoriaActiva, busqueda, orden]);

  const totalTecnicas = useMemo(
    () => new Set(obras.map((o) => o.technique).filter(Boolean)).size,
    [obras]
  );

  const restaurarFiltros = () => {
    setBusqueda('');
    setCategoriaActiva('Todos');
    setOrden('reciente');
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
            <span className="font-bold uppercase">Cargando portafolio...</span>
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
            No fue posible cargar el portafolio
          </h2>
          <p className="mt-2 text-sm" style={{ color: C.onSurfaceVariant }}>
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
              <Brush size={16} />
              PORTAFOLIO ARTÍSTICO
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
              GALERÍA ACTUALIZADA
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
                  {ARTISTA.nombreArtistico}
                </span>

                <span className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  {ARTISTA.nombreCompleto}
                </span>
              </div>

              <h1
                className="font-['Bricolage_Grotesque',sans-serif] font-extrabold uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl"
                style={{ color: C.onSurface }}
              >
                GALERÍA &{' '}
                <span
                  className="inline-block px-3 py-2 mt-2 rounded-xl border-[3px] shadow-[4px_4px_0_#1a1c1a] -rotate-1"
                  style={{
                    backgroundColor: C.primaryContainer,
                    color: C.onPrimaryContainer,
                    borderColor: C.onSurface,
                  }}
                >
                  OBRAS
                </span>
              </h1>

              <p
                className="max-w-2xl text-base sm:text-lg leading-relaxed"
                style={{ color: C.onSurfaceVariant }}
              >
                {ARTISTA.bio}
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
                100% INDIE
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
                  ¿ENCARGOS Y COMISIONES?
                </div>

                <p className="text-sm sm:text-base leading-snug" style={{ color: C.onSurface }}>
                  “{ARTISTA.cita}” Disponible para colaboraciones editoriales y
                  comisiones privadas. Escribe directo a{' '}
                  <strong className="underline">{INSTAGRAM_HANDLE}</strong>.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <div
                    className="px-3 py-2 rounded-lg border-2 text-center"
                    style={{ backgroundColor: C.surfaceLow, borderColor: C.onSurface }}
                  >
                    <span className="font-['Bricolage_Grotesque',sans-serif] text-lg font-extrabold block leading-none" style={{ color: C.primary }}>
                      {obras.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold" style={{ color: C.onSurfaceVariant }}>
                      Obras
                    </span>
                  </div>
                  <div
                    className="px-3 py-2 rounded-lg border-2 text-center"
                    style={{ backgroundColor: C.surfaceLow, borderColor: C.onSurface }}
                  >
                    <span className="font-['Bricolage_Grotesque',sans-serif] text-lg font-extrabold block leading-none" style={{ color: C.primary }}>
                      {totalTecnicas}
                    </span>
                    <span className="text-[10px] uppercase font-bold" style={{ color: C.onSurfaceVariant }}>
                      Técnicas
                    </span>
                  </div>

                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-[2.5px] shadow-[4px_4px_0_#1a1c1a] font-bold text-xs sm:text-sm uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#1a1c1a]"
                    style={{
                      backgroundColor: C.primaryContainer,
                      color: C.onPrimaryContainer,
                      borderColor: C.onSurface,
                    }}
                  >
                    <Send size={17} />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      {obras.length > 0 && (
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
                SERIE:
              </span>

              {categorias.map((cat) => {
                const cantidad = cat === 'Todos' ? obras.length : cantidadPorCategoria[cat] || 0;
                const activo = categoriaActiva === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaActiva(cat)}
                    className="shrink-0 px-3 py-2 rounded-lg border-2 text-[11px] sm:text-xs font-bold uppercase shadow-[2px_2px_0_#1a1c1a] transition-all hover:-translate-y-0.5"
                    style={{
                      backgroundColor: activo ? C.primaryContainer : C.surfaceLowest,
                      color: activo ? C.onPrimaryContainer : C.onSurface,
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
                  placeholder="Buscar obra o técnica..."
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
                <option value="reciente">MÁS RECIENTE</option>
                <option value="antiguo">MÁS ANTIGUO</option>
                <option value="name">NOMBRE (A-Z)</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {obras.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border-[3px] font-bold uppercase"
            style={{
              backgroundColor: C.surfaceLow,
              borderColor: C.onSurface,
              boxShadow: `5px 5px 0 ${C.onSurface}`,
            }}
          >
            Aún no hay obras en el portafolio.
          </div>
        ) : obrasFiltradas.length === 0 ? (
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
              No hay obras con ese filtro
            </h3>

            <p className="text-sm max-w-md" style={{ color: C.onSurfaceVariant }}>
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
          /*
            ÚNICA DIFERENCIA DE ESTILO vs. Catálogo: en vez de un grid con celdas de
            igual alto, usamos columnas CSS (`columns-*`) y las imágenes conservan su
            proporción NATURAL (sin aspect-ratio fijo ni object-cover), así que una
            pieza vertical se ve alta y una horizontal se ve ancha y corta.
          */
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 [column-fill:_balance]">
            {obrasFiltradas.map((obra) => (
              <article
                key={obra.id}
                className="group relative mb-6 break-inside-avoid flex flex-col overflow-hidden rounded-2xl border-[3px] transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: C.surfaceLowest,
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                {/* Image panel — display dinámico, sin recorte forzado */}
                <div
                  className="relative overflow-hidden border-b-[3px]"
                  style={{
                    backgroundColor: C.surfaceHigh,
                    borderColor: C.onSurface,
                  }}
                >
                  {obra.category_name && (
                    <span
                      className="absolute top-2 left-2 z-10 px-2 py-1 rounded border-2 text-[10px] font-bold uppercase shadow-[1px_1px_0_#1a1c1a]"
                      style={{
                        backgroundColor: C.surfaceLowest,
                        color: C.onSurface,
                        borderColor: C.onSurface,
                      }}
                    >
                      {obra.category_name}
                    </span>
                  )}

                  {obra.project_type && (
                    <span
                      className="absolute bottom-2 right-2 z-10 px-2 py-1 rounded border-2 text-[10px] font-bold uppercase shadow-[1px_1px_0_#1a1c1a] rotate-2"
                      style={{
                        backgroundColor: C.secondaryContainer,
                        color: C.onSecondaryContainer,
                        borderColor: C.onSurface,
                      }}
                    >
                      {obra.project_type}
                    </span>
                  )}

                  {obra.primary_image_url ? (
                    <img
                      src={obra.primary_image_url}
                      alt={obra.title}
                      loading="lazy"
                      className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div
                      className="w-full h-56 flex items-center justify-center text-xs font-bold uppercase"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Obra info */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      {obra.technique ? (
                        <span className="text-[11px] font-bold" style={{ color: C.primary }}>
                          {obra.technique.toUpperCase()}
                        </span>
                      ) : (
                        <span />
                      )}

                      {obra.completion_date && (
                        <span className="text-[11px] font-bold" style={{ color: C.onSurfaceVariant }}>
                          {new Date(obra.completion_date).getFullYear()}
                        </span>
                      )}
                    </div>

                    <h2
                      className="font-['Bricolage_Grotesque',sans-serif] font-bold text-lg leading-tight"
                      title={obra.title}
                    >
                      {obra.title}
                    </h2>

                    {obra.description && (
                      <p className="text-sm line-clamp-2" style={{ color: C.onSurfaceVariant }}>
                        {obra.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: C.surfaceHigh }}>
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
                      Consultar vía IG ({INSTAGRAM_HANDLE})
                    </a>

                    <button
                      type="button"
                      onClick={() => setObraSeleccionada(obra)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 rounded border text-[11px] font-bold uppercase transition-colors"
                      style={{
                        backgroundColor: C.onSurface,
                        color: C.surfaceLowest,
                        borderColor: C.onSurface,
                      }}
                    >
                      <Palette size={14} />
                      Ver ficha técnica
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal de ficha técnica */}
      {obraSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ backgroundColor: 'rgba(26,28,26,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={(e) => e.target === e.currentTarget && setObraSeleccionada(null)}
        >
          <div
            className="rounded-2xl p-6 max-w-lg w-full flex flex-col gap-4 border-[3px]"
            style={{
              backgroundColor: C.surfaceLowest,
              borderColor: C.onSurface,
              boxShadow: `6px 6px 0 ${C.onSurface}`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Palette size={20} style={{ color: C.primary }} />
                <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl">
                  {obraSeleccionada.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setObraSeleccionada(null)}
                className="p-1 rounded-lg border-2 shrink-0"
                style={{ backgroundColor: C.surfaceLow, borderColor: C.onSurface }}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
              {obraSeleccionada.description || 'Sin descripción disponible.'}
            </p>

            <div
              className="grid grid-cols-2 gap-3 p-3 rounded-xl border-2"
              style={{ backgroundColor: C.surfaceLow, borderColor: C.onSurface }}
            >
              <div>
                <span className="text-xs block font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                  Técnica
                </span>
                <span className="text-sm font-bold">{obraSeleccionada.technique || '—'}</span>
              </div>
              <div>
                <span className="text-xs block font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                  Año
                </span>
                <span className="text-sm font-bold" style={{ color: C.primary }}>
                  {obraSeleccionada.completion_date
                    ? new Date(obraSeleccionada.completion_date).getFullYear()
                    : '—'}
                </span>
              </div>
              {obraSeleccionada.category_name && (
                <div>
                  <span className="text-xs block font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                    Categoría
                  </span>
                  <span className="text-sm font-bold">{obraSeleccionada.category_name}</span>
                </div>
              )}
              {obraSeleccionada.project_type && (
                <div>
                  <span className="text-xs block font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                    Tipo de proyecto
                  </span>
                  <span className="text-sm font-bold">{obraSeleccionada.project_type}</span>
                </div>
              )}
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg border-2 shadow-[3px_3px_0_#1a1c1a] font-bold uppercase text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5"
              style={{
                backgroundColor: C.primaryContainer,
                color: C.onPrimaryContainer,
                borderColor: C.onSurface,
              }}
            >
              <Send size={16} /> Consultar encargo o print por IG ({INSTAGRAM_HANDLE})
            </a>
          </div>
        </div>
      )}
    </div>
  );
}