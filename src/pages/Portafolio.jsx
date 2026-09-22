import { useState, useEffect, useMemo } from 'react';
import { Send, X, Palette, Bookmark } from 'lucide-react';
import api from '../services/api';

// Colores tomados del design system del mockup público DaxShop.
// Si tu tailwind.config.js ya define estos tokens, puedes cambiar estos hex por clases.
const C = {
  primary: '#b8004c',
  onPrimary: '#ffffff',
  primaryContainer: '#de2263',
  onPrimaryContainer: '#fffbff',
  secondary: '#9d4300',
  onSecondary: '#ffffff',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
  tertiary: '#655862',
  inverseSurface: '#2f312f',
};

const INSTAGRAM_URL = 'https://instagram.com/daxth1';
const INSTAGRAM_HANDLE = '@daxth1';

// Contenido de la artista/estudio — ajusta estos textos si cambian.
const ARTISTA = {
  nombreArtistico: 'DAX',
  nombreCompleto: 'Jenifer Yasmin Rodas Castañeda',
  tag: '@daxth1',
  bio: 'Exploración de narrativa visual, viñetas callejeras, leyendas guatemaltecas y fanarts icónicos. Fusión de técnicas tradicionales al acrílico/óleo con ilustración pop cómic y zines autopublicados.',
  cita: 'El arte callejero y la viñeta cómic son la voz pura de la juventud y el color sin censura.',
  ubicacion: 'Guatemala · Universidad de San Carlos',
};

export default function Portafolio() {
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerObras = async () => {
      try {
        const respuesta = await api.get('/portafolio');
        setObras(respuesta.data.datos);
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

  const obrasFiltradas = useMemo(() => {
    if (categoriaActiva === 'Todos') return obras;
    return obras.filter((o) => o.category_name === categoriaActiva);
  }, [obras, categoriaActiva]);

  // Stats dinámicos derivados de las obras reales
  const totalObras = obras.length;
  const totalTecnicas = useMemo(
    () => new Set(obras.map((o) => o.technique).filter(Boolean)).size,
    [obras]
  );

  if (cargando) {
    return (
      <div className="text-center py-20 font-bold text-xl uppercase" style={{ color: C.onSurface }}>
        Cargando portafolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 font-bold" style={{ color: '#ba1a1a' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="font-['Rubik',sans-serif] relative" style={{ color: C.onSurface }}>
      {/* Ticker superior */}
      <div
        className="w-full py-2 overflow-hidden select-none mb-6 rounded-lg"
        style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer }}
      >
        <div className="flex items-center gap-8 whitespace-nowrap px-3 text-xs font-bold uppercase tracking-wide animate-pulse overflow-x-auto no-scrollbar">
          <span>⚡ Portafolio artístico oficial · Daxth1 · {ARTISTA.nombreCompleto} ⚡</span>
          <span>★ Ilustradora digital &amp; tradicional ★</span>
          <span>⚡ Zines · Comic panels · Street art · Fanarts · Merch ⚡</span>
        </div>
      </div>

      {/* Hero con bio de la artista */}
      <div
        className="relative rounded-xl p-5 lg:p-8 mb-8 overflow-hidden"
        style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col gap-3">
            <span
              className="self-start px-3 py-1 rounded font-bold uppercase text-xs"
              style={{ backgroundColor: C.primary, color: C.onPrimary }}
            >
              Portafolio Artístico
            </span>
            <h1 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-3xl lg:text-4xl uppercase tracking-tight leading-none">
              DAXTH1 <span style={{ color: C.primary, fontWeight: 400 }}>/</span> STUDIO
            </h1>
            <div
              className="inline-block px-3 py-1 rounded-lg self-start"
              style={{ backgroundColor: C.surfaceHigh, transform: 'rotate(-1deg)' }}
            >
              <span className="font-bold" style={{ color: C.primary }}>{ARTISTA.nombreCompleto}</span>
            </div>
            <p className="max-w-2xl" style={{ color: C.onSurfaceVariant }}>{ARTISTA.bio}</p>

            {categorias.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className="text-xs uppercase flex items-center gap-1 font-bold"
                  style={{ color: C.tertiary }}
                >
                  <Bookmark size={14} /> Índice:
                </span>
                {categorias
                  .filter((c) => c !== 'Todos')
                  .map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ backgroundColor: C.surfaceLow }}
                    >
                      {c}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div
              className="relative w-full max-w-xs p-5 rounded-2xl text-center"
              style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, boxShadow: `4px 4px 0 ${C.onSurface}`, transform: 'rotate(2deg)' }}
            >
              <span className="text-xs uppercase tracking-widest opacity-90 block">Tag &amp; Pseudónimo</span>
              <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-4xl block">
                {ARTISTA.nombreArtistico}
              </span>
              <p className="text-sm opacity-95 mt-2">"{ARTISTA.cita}"</p>
              <div
                className="mt-3 px-3 py-1.5 rounded-lg text-xs"
                style={{ backgroundColor: C.surfaceLowest, color: C.onSurface }}
              >
                📍 {ARTISTA.ubicacion}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-3xl uppercase tracking-tight pb-3 mb-6 border-b-[3px]" style={{ borderColor: C.onSurface }}>
        Galería de Arte
      </h2>

      {obras.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center font-bold uppercase"
          style={{ backgroundColor: C.surfaceLow, boxShadow: `4px 4px 0 ${C.onSurface}` }}
        >
          Aún no hay obras en el portafolio.
        </div>
      ) : (
        <>
          {/* Filtros por categoría */}
          {categorias.length > 2 && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl mb-6" style={{ backgroundColor: C.surfaceLow }}>
              <div className="flex flex-wrap items-center gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaActiva(cat)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all"
                    style={{
                      backgroundColor: categoriaActiva === cat ? C.primary : C.surfaceLowest,
                      color: categoriaActiva === cat ? C.onPrimary : C.onSurfaceVariant,
                      boxShadow: categoriaActiva === cat ? 'none' : `2px 2px 0 ${C.onSurface}`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold uppercase" style={{ color: C.tertiary }}>
                Mostrando: <span style={{ color: C.onSurface }}>{obrasFiltradas.length} obras</span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {obrasFiltradas.map((obra) => (
              <article
                key={obra.id}
                className="rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
              >
                <div className="relative" style={{ backgroundColor: C.surfaceHigh }}>
                  {obra.category_name && (
                    <span
                      className="absolute top-3 left-3 z-10 px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                    >
                      {obra.category_name}
                    </span>
                  )}
                  {obra.project_type && (
                    <span
                      className="absolute top-3 right-3 z-10 px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                    >
                      {obra.project_type}
                    </span>
                  )}
                  <div className="aspect-[4/5] flex items-center justify-center">
                    {obra.primary_image_url ? (
                      <img
                        src={obra.primary_image_url}
                        alt={obra.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                        Sin imagen
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-lg uppercase leading-tight">
                      {obra.title}
                    </h3>
                    <p className="text-xs font-bold uppercase mt-1" style={{ color: C.tertiary }}>
                      {obra.technique}
                      {obra.completion_date && ` · ${new Date(obra.completion_date).getFullYear()}`}
                    </p>
                    {obra.description && (
                      <p className="text-sm mt-2 line-clamp-2" style={{ color: C.onSurfaceVariant }}>
                        {obra.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setObraSeleccionada(obra)}
                    className="w-full py-1.5 rounded text-xs font-bold uppercase transition-colors"
                    style={{ backgroundColor: C.surfaceLow, color: C.onSurface }}
                  >
                    Ver ficha técnica
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Bio & stats de la artista */}
          <div
            className="mt-10 rounded-xl p-5 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
            style={{ backgroundColor: C.surfaceLow, boxShadow: `4px 4px 0 ${C.onSurface}` }}
          >
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                  style={{ backgroundColor: C.primary, color: C.onPrimary }}
                >
                  Perfil artístico
                </span>
                <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold">{ARTISTA.nombreCompleto}</span>
              </div>
              <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                Disponible para comisiones privadas, colaboraciones editoriales y participación en convenciones o mercaditos de ilustración. Contacto directo vía Instagram {ARTISTA.tag}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-5 py-3 rounded-xl text-center" style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}>
                <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl block" style={{ color: C.primary }}>
                  {totalObras}
                </span>
                <span className="text-xs" style={{ color: C.tertiary }}>Obras en catálogo</span>
              </div>
              <div className="px-5 py-3 rounded-xl text-center" style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}>
                <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl block" style={{ color: C.secondary }}>
                  {totalTecnicas}
                </span>
                <span className="text-xs" style={{ color: C.tertiary }}>Técnicas distintas</span>
              </div>
              <div className="px-5 py-3 rounded-xl text-center" style={{ backgroundColor: C.surfaceLowest, boxShadow: `3px 3px 0 ${C.onSurface}` }}>
                <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl block">100%</span>
                <span className="text-xs" style={{ color: C.tertiary }}>Independiente</span>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div
            className="mt-8 rounded-2xl p-6 lg:p-10 text-center flex flex-col items-center gap-3"
            style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, boxShadow: `6px 6px 0 ${C.onSurface}` }}
          >
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase"
              style={{ backgroundColor: C.surfaceLowest, color: C.onSurface }}
            >
              ¿Tienes una idea o encargo en mente?
            </span>
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl lg:text-3xl uppercase tracking-tight max-w-2xl leading-tight">
              Colaboraciones, portadas o fanarts personalizados
            </h2>
            <p className="max-w-xl opacity-90 text-sm">
              Sin intermediarios ni carritos fríos: todo se platica directamente en el buzón de Instagram.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase transition-transform hover:scale-105"
              style={{ backgroundColor: C.primary, color: C.onPrimary, boxShadow: `4px 4px 0 ${C.onSurface}` }}
            >
              <Send size={18} /> Pedir vía Instagram ({INSTAGRAM_HANDLE})
            </a>
          </div>
        </>
      )}

      {/* Modal de ficha técnica */}
      {obraSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ backgroundColor: 'rgba(47,49,47,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={(e) => e.target === e.currentTarget && setObraSeleccionada(null)}
        >
          <div
            className="rounded-2xl p-6 max-w-lg w-full flex flex-col gap-4"
            style={{ backgroundColor: C.surfaceLowest, boxShadow: `6px 6px 0 ${C.onSurface}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette size={20} style={{ color: C.primary }} />
                <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl">
                  {obraSeleccionada.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setObraSeleccionada(null)}
                className="p-1 rounded-lg"
                style={{ backgroundColor: C.surfaceLow }}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
              {obraSeleccionada.description || 'Sin descripción disponible.'}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl" style={{ backgroundColor: C.surfaceLow }}>
              <div>
                <span className="text-xs block" style={{ color: C.tertiary }}>Técnica</span>
                <span className="text-sm font-bold">{obraSeleccionada.technique || '—'}</span>
              </div>
              <div>
                <span className="text-xs block" style={{ color: C.tertiary }}>Año</span>
                <span className="text-sm font-bold" style={{ color: C.primary }}>
                  {obraSeleccionada.completion_date
                    ? new Date(obraSeleccionada.completion_date).getFullYear()
                    : '—'}
                </span>
              </div>
              {obraSeleccionada.category_name && (
                <div>
                  <span className="text-xs block" style={{ color: C.tertiary }}>Categoría</span>
                  <span className="text-sm font-bold">{obraSeleccionada.category_name}</span>
                </div>
              )}
              {obraSeleccionada.project_type && (
                <div>
                  <span className="text-xs block" style={{ color: C.tertiary }}>Tipo de proyecto</span>
                  <span className="text-sm font-bold">{obraSeleccionada.project_type}</span>
                </div>
              )}
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg font-bold uppercase text-sm"
              style={{ backgroundColor: C.primary, color: C.onPrimary }}
            >
              <Send size={16} /> Consultar encargo o print por IG ({INSTAGRAM_HANDLE})
            </a>
          </div>
        </div>
      )}
    </div>
  );
}