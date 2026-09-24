import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Calculator,
  Copy,
  Check,
  Info,
  Wallet,
  PenTool,
  Copyright,
  Mail,
  Music2,
  Images,
  ShieldCheck,
  Palette,
  Clock,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';

const C = {
  primary: '#b8004c',
  onPrimary: '#ffffff',
  primaryContainer: '#de2263',
  onPrimaryContainer: '#fffbff',
  secondary: '#9d4300',
  onSecondary: '#ffffff',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  secondaryFixed: '#ffdbca',
  onSecondaryFixed: '#341100',
  tertiary: '#655862',
  surface: '#faf9f6',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceContainer: '#efeeeb',
  surfaceHigh: '#e9e8e5',
  surfaceHighest: '#e3e2e0',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
  inverseSurface: '#2f312f',
  inverseOnSurface: '#f1f1ee',
  outline: '#8e6f74',
  error: '#ba1a1a',
};

const INSTAGRAM_URL = 'https://instagram.com/daxth1';
const INSTAGRAM_HANDLE = '@daxth1';
const EMAIL = 'daxth1.art@gmail.com';

// Multiplicadores/costos extra del cotizador. No vienen de la API — son
// modificadores genéricos que se aplican sobre el precio base de cualquier
// tipo de comisión seleccionado.
const OPCIONES_PERSONAJES = [
  { valor: 1, etiqueta: '1 Personaje' },
  { valor: 1.7, etiqueta: '2 Personajes (+70%)' },
  { valor: 2.3, etiqueta: '3+ Personajes / Grupo (+130%)' },
];

const OPCIONES_USO = [
  { valor: 0, etiqueta: 'Personal (redes, avatar, impresión propia)' },
  { valor: 150, etiqueta: 'Comercial / Merch (+Q150 / ~$20 USD)' },
];

// Normaliza el registro de comisión: la plantilla original usa name /
// base_price_quetzales / base_price_usd, mientras que el modelo del backend
// expone type_name / price_quetzales / price_usd. Soportamos ambas formas.
function normalizarComision(c) {
  return {
    id: c.id,
    nombre: c.name || c.type_name || 'Comisión',
    descripcion: c.description || '',
    precioQ: Number(c.base_price_quetzales ?? c.price_quetzales) || 0,
    precioUsd: Number(c.base_price_usd ?? c.price_usd) || 0,
    tiempoEstimado: c.estimated_time || '',
    imagen: c.cover_image_url || null,
  };
}

export default function Comisiones() {
  const [comisionesRaw, setComisionesRaw] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // --- Cotizador ---
  const [tipoIndex, setTipoIndex] = useState(0);
  const [personajes, setPersonajes] = useState(OPCIONES_PERSONAJES[0].valor);
  const [uso, setUso] = useState(OPCIONES_USO[0].valor);
  const [idea, setIdea] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const obtenerComisiones = async () => {
      try {
        const respuesta = await api.get('/comisiones');
        setComisionesRaw(respuesta.data.datos || []);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la información de comisiones.');
      } finally {
        setCargando(false);
      }
    };
    obtenerComisiones();
  }, []);

  const comisiones = useMemo(() => comisionesRaw.map(normalizarComision), [comisionesRaw]);

  const comisionSeleccionada = comisiones[tipoIndex] || null;

  const estimado = useMemo(() => {
    if (!comisionSeleccionada) return { gtq: 0, usd: 0 };
    const totalGtq = Math.round(comisionSeleccionada.precioQ * personajes + uso);
    const tasa =
      comisionSeleccionada.precioUsd > 0
        ? comisionSeleccionada.precioQ / comisionSeleccionada.precioUsd
        : 7.8;
    const totalUsd = Math.round(totalGtq / tasa);
    return { gtq: totalGtq, usd: totalUsd };
  }, [comisionSeleccionada, personajes, uso]);

  const construirMensaje = () => {
    const tipoTexto = comisionSeleccionada ? comisionSeleccionada.nombre : 'Comisión';
    const personajesTexto =
      OPCIONES_PERSONAJES.find((o) => o.valor === personajes)?.etiqueta || '1 Personaje';
    const usoTexto = OPCIONES_USO.find((o) => o.valor === uso)?.etiqueta || 'Personal';
    const ideaTexto = idea.trim() || 'Sin detalles específicos aún';

    return (
      `¡Hola(@daxth1)! Me gustaría cotizar un encargo en DaxShop:\n\n` +
      `• Tipo: ${tipoTexto}\n` +
      `• Cantidad: ${personajesTexto}\n` +
      `• Uso: ${usoTexto}\n` +
      `• Idea: ${ideaTexto}\n` +
      `• Estimado web: ~Q${estimado.gtq} (~$${estimado.usd} USD)\n\n` +
      `¿Tienes cupo disponible para coordinar? ¡Gracias!`
    );
  };

  const handleCopiarMensaje = async () => {
    const texto = construirMensaje();
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.error(err);
      alert(`Texto para DM listo:\n\n${texto}`);
    }
  };

  const handleAbrirInstagram = () => {
    const texto = construirMensaje();
    navigator.clipboard?.writeText(texto).catch(() => {});
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
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
            <span className="font-bold uppercase">Cargando tarifas...</span>
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
            No fue posible cargar las comisiones
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
      style={{ backgroundColor: C.surface, color: C.onSurface }}
    >
      {/* TICKER SUPERIOR */}
      <div
        className="w-full py-2 overflow-hidden select-none"
        style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer }}
      >
        <div className="flex items-center gap-8 whitespace-nowrap px-3 text-xs font-bold uppercase tracking-wide overflow-x-auto no-scrollbar">
          <span className="flex items-center gap-1.5">
            <Palette size={13} /> COMISIONES OFICIALES · DAXTH1 STUDIO
          </span>
          <span className="px-2 py-0.5 rounded" style={{ backgroundColor: C.surfaceLowest, color: C.onSurface }}>
            SLOTS LIMITADOS
          </span>
          <span className="hidden md:inline font-medium normal-case">
            · Ilustración Digital &amp; Street Art Tradicional
          </span>
        </div>
      </div>

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b-[3px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
        style={{ backgroundColor: C.surfaceLow, borderColor: C.onSurface }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${C.onSurface} 1.5px, transparent 1.5px)`,
            backgroundSize: '14px 14px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-xs font-bold uppercase -rotate-1"
                style={{
                  backgroundColor: C.primaryContainer,
                  color: C.onPrimaryContainer,
                  borderColor: C.onSurface,
                  boxShadow: `2px 2px 0 ${C.onSurface}`,
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.surfaceLowest }} />
                {comisiones.length > 0 ? `${comisiones.length} ESTILOS DISPONIBLES` : 'CUPOS DISPONIBLES'}
              </span>
              <span
                className="px-2 py-1 rounded text-[11px] font-bold uppercase border-2"
                style={{ backgroundColor: C.surfaceHigh, borderColor: C.onSurface }}
              >
                ENTREGA: 5 A 10 DÍAS
              </span>
            </div>

            <div className="relative">
              <h1
                className="font-['Bricolage_Grotesque',sans-serif] font-extrabold uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl"
              >
                Comisiones de Arte &amp; Contacto
              </h1>
              <div
                className="hidden sm:block absolute -top-3 -right-2 px-3 py-1 rounded rotate-12 text-xs font-bold uppercase border-2"
                style={{
                  backgroundColor: C.secondaryContainer,
                  color: C.onSecondaryContainer,
                  borderColor: C.onSurface,
                  boxShadow: `3px 3px 0 ${C.onSurface}`,
                }}
              >
                ¡100% ORIGINAL!
              </div>
            </div>

            <div
              className="relative p-5 rounded-xl border-[3px]"
              style={{
                backgroundColor: C.surfaceLowest,
                borderColor: C.onSurface,
                boxShadow: `5px 5px 0 ${C.onSurface}`,
              }}
            >
              <div className="flex items-start gap-3">
                <MessageCircle size={28} className="shrink-0" style={{ color: C.primaryContainer }} />
                <div className="flex flex-col gap-1">
                  <p className="font-['Bricolage_Grotesque',sans-serif] font-bold uppercase" style={{ color: C.primary }}>
                    ¡Cupos abiertos para encargos personalizados!
                  </p>
                  <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                    Ilustración digital para avatares, personajes originales (OC), fanart o cuadros sobre lienzo con técnicas mixtas y acrílico urbano.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-[2.5px] font-bold text-sm uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                style={{
                  backgroundColor: C.primaryContainer,
                  color: C.onPrimaryContainer,
                  borderColor: C.onSurface,
                  boxShadow: `4px 4px 0 ${C.onSurface}`,
                }}
              >
                <Send size={18} />
                CONTACTAR EN INSTAGRAM ({INSTAGRAM_HANDLE})
              </a>
              <a
                href="#cotizador"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 font-bold text-sm uppercase transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: C.surfaceHigh,
                  borderColor: C.onSurface,
                  boxShadow: `3px 3px 0 ${C.onSurface}`,
                }}
              >
                <Calculator size={16} />
                SIMULAR PRESUPUESTO
              </a>
            </div>
          </div>

          {/* Panel visual */}
          <div className="lg:col-span-5 relative">
            <div
              className="absolute inset-0 rounded-2xl rotate-2 translate-x-2 translate-y-2"
              style={{ backgroundColor: C.secondaryContainer, boxShadow: `6px 6px 0 ${C.onSurface}` }}
            />
            <div
              className="relative p-5 rounded-2xl flex flex-col gap-4 overflow-hidden"
              style={{
                backgroundColor: C.inverseSurface,
                color: C.inverseOnSurface,
                boxShadow: `6px 6px 0 ${C.onSurface}`,
              }}
            >
              <div className="flex items-center justify-between border-b-2 pb-2" style={{ borderColor: C.outline }}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: C.primaryContainer }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: C.secondaryContainer }} />
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: '#d3c2cd' }}>
                    DAXTH1_ID_PANEL.EXE
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                >
                  ARTISTA INDIE
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-['Bricolage_Grotesque',sans-serif] font-extrabold text-lg shrink-0"
                  style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                >
                  DX
                </div>
                <div>
                  <p className="font-bold uppercase leading-tight"></p>
                  <p className="text-xs opacity-80">Digital &amp; Tradicional · @daxth1</p>
                </div>
                <span
                  className="ml-auto px-2 py-1 rounded-full text-[10px] font-bold uppercase rotate-3 shrink-0"
                  style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer }}
                >
                  ¡Dando vida a tus ideas!
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg" style={{ backgroundColor: C.surfaceContainer, color: C.onSurface }}>
                  <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-lg block" style={{ color: C.primary }}>
                    300
                  </span>
                  <span className="text-[10px] uppercase font-bold">DPI Ultra HD</span>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: C.surfaceContainer, color: C.onSurface }}>
                  <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-lg block" style={{ color: C.secondary }}>
                    100%
                  </span>
                  <span className="text-[10px] uppercase font-bold">Original</span>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: C.surfaceContainer, color: C.onSurface }}>
                  <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-lg block">DM</span>
                  <span className="text-[10px] uppercase font-bold">Trato Directo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="w-full py-12 sm:py-16" style={{ backgroundColor: C.surfaceContainer }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
            <div>
              <span
                className="inline-block px-3 py-1 rounded text-xs font-bold uppercase border-2"
                style={{ backgroundColor: C.surfaceHighest, borderColor: C.onSurface }}
              >
                PROTOCOLO DE PEDIDO
              </span>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl sm:text-3xl uppercase tracking-tight mt-2">
                ¿Cómo encargar tu pieza?
              </h2>
            </div>
            <p className="max-w-md text-sm" style={{ color: C.onSurfaceVariant }}>
              Sin formularios fríos ni bots. Coordinación clara directamente con Daxth1 desde la primera idea hasta la entrega final.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                numero: 1,
                bg: C.secondaryContainer,
                fg: C.onSecondaryContainer,
                titulo: 'Elige tu categoría & referencias',
                texto: 'Revisa la tabla de precios abajo. Prepara imágenes de referencia, paleta sugerida o la idea clave que quieres plasmar.',
                pie: 'Busto, cuerpo o tradicional',
                Icono: CheckCircle2,
              },
              {
                numero: 2,
                bg: C.primaryContainer,
                fg: C.onPrimaryContainer,
                titulo: `Escribe un DM a ${INSTAGRAM_HANDLE}`,
                texto: 'Toca el botón directo de Instagram para iniciar la conversación y confirmar disponibilidad, estilo y fecha estimada.',
                pie: '50% anticipo para reservar',
                Icono: Wallet,
              },
              {
                numero: 3,
                bg: C.inverseSurface,
                fg: C.inverseOnSurface,
                titulo: 'Bocetos, ajustes y entrega',
                texto: 'Recibes fase de boceto para dar feedback - Entrega 100% digital.',
                pie: 'Garantía de satisfacción y fidelidad',
                Icono: PenTool,
              },
            ].map((paso) => (
              <div
                key={paso.numero}
                className="p-5 rounded-xl border-[3px] flex flex-col justify-between transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: C.surfaceLowest,
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-['Bricolage_Grotesque',sans-serif] font-extrabold border-2"
                      style={{ backgroundColor: paso.bg, color: paso.fg, borderColor: C.onSurface }}
                    >
                      {paso.numero}
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: C.surfaceHigh, color: C.onSurfaceVariant }}
                    >
                      PASO {paso.numero === 1 ? 'UNO' : paso.numero === 2 ? 'DOS' : 'TRES'}
                    </span>
                  </div>
                  <h3 className="font-['Bricolage_Grotesque',sans-serif] font-bold uppercase leading-tight">
                    {paso.titulo}
                  </h3>
                  <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                    {paso.texto}
                  </p>
                </div>
                <div className="mt-4 pt-2 flex items-center gap-2 text-sm font-bold" style={{ color: C.primary }}>
                  <paso.Icono size={16} />
                  <span>{paso.pie}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFAS — datos reales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-center text-center gap-2 mb-10">
          <span
            className="inline-block px-3 py-1 rounded text-xs font-bold uppercase border-2"
            style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, borderColor: C.onSurface }}
          >
            TARIFAS TRANSPARENTES
          </span>
          <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
            Tabla de Cotizaciones Base
          </h2>
          <p className="max-w-xl text-sm" style={{ color: C.onSurfaceVariant }}>
            Precios estándar para uso personal. Los valores pueden variar según la complejidad de armaduras, armas o fondos hiperdetallados.
          </p>
        </div>

        {comisiones.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border-[3px] font-bold uppercase"
            style={{ backgroundColor: C.surfaceLow, borderColor: C.onSurface, boxShadow: `5px 5px 0 ${C.onSurface}` }}
          >
            No hay información de comisiones por el momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comisiones.map((comision) => (
              <div
                key={comision.id}
                className="rounded-xl overflow-hidden flex flex-col justify-between border-[3px] transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: C.surfaceLowest,
                  borderColor: C.onSurface,
                  boxShadow: `5px 5px 0 ${C.onSurface}`,
                }}
              >
                <div>
                  {/* Imagen de referencia */}
                  <div
                    className="relative h-40 border-b-[3px] overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: C.surfaceHigh, borderColor: C.onSurface }}
                  >
                    {comision.imagen ? (
                      <img src={comision.imagen} alt={comision.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                        Sin imagen
                      </span>
                    )}
                    {comision.tiempoEstimado && (
                      <span
                        className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase border-2"
                        style={{
                          backgroundColor: C.secondaryContainer,
                          color: C.onSecondaryContainer,
                          borderColor: C.onSurface,
                        }}
                      >
                        {comision.tiempoEstimado}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase" style={{ color: C.primary }}>
                      Tipo de Comisión
                    </span>
                    <h3 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-lg leading-tight">
                      {comision.nombre}
                    </h3>
                    {comision.descripcion && (
                      <p className="text-sm line-clamp-3" style={{ color: C.onSurfaceVariant }}>
                        {comision.descripcion}
                      </p>
                    )}

                    <div className="mt-1 p-3 rounded-lg" style={{ backgroundColor: C.surfaceLow }}>
                      <span className="text-[11px] font-bold uppercase block" style={{ color: C.onSurfaceVariant }}>
                        Precio Base
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl" style={{ color: C.primary }}>
                          Q{comision.precioQ}
                        </span>
                        <span className="text-xs font-bold" style={{ color: C.onSurfaceVariant }}>
                          (${comision.precioUsd} USD)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-sm font-bold uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                    style={{
                      backgroundColor: C.primaryContainer,
                      color: C.onPrimaryContainer,
                      borderColor: C.onSurface,
                      boxShadow: `3px 3px 0 ${C.onSurface}`,
                    }}
                  >
                    <MessageCircle size={16} /> Cotizar este estilo
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* TÉRMINOS DE SERVICIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div
          className="p-6 md:p-8 rounded-2xl border-[3px]"
          style={{ backgroundColor: C.surfaceContainer, borderColor: C.onSurface, boxShadow: `6px 6px 0 ${C.onSurface}` }}
        >
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span
              className="px-3 py-1 rounded text-xs font-bold uppercase border-2"
              style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, borderColor: C.onSurface }}
            >
              REGLAS CLARAS
            </span>
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl uppercase">
              Términos de Servicio &amp; Garantías
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                Icono: Wallet,
                titulo: '100% Anticipo',
                texto: 'Para separar tu cupo en la agenda se requiere el 100% de abono.',
              },
              {
                Icono: PenTool,
                titulo: 'Revisiones de Boceto',
                texto: '1 a 2 etapas de cambios en la fase de boceto (pose, expresión, elementos). Ya entintado, solo ajustes menores de tono.',
              },
              {
                Icono: Copyright,
                titulo: 'Uso Personal vs Comercial',
                texto: 'Las tarifas base son para uso personal. Para merch, portadas musicales o reventa aplica un tarifario comercial acordado antes.',
              },
            ].map((item) => (
              <div
                key={item.titulo}
                className="p-4 rounded-xl border-2 flex flex-col gap-2"
                style={{ backgroundColor: C.surfaceLowest, borderColor: C.onSurface, boxShadow: `3px 3px 0 ${C.onSurface}` }}
              >
                <div className="flex items-center gap-2 font-['Bricolage_Grotesque',sans-serif] font-bold" style={{ color: C.primary }}>
                  <item.Icono size={20} />
                  <span>{item.titulo}</span>
                </div>
                <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  {item.texto}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-5 p-4 rounded-xl border-2 flex items-center gap-3"
            style={{ backgroundColor: C.secondaryFixed, color: C.onSecondaryFixed, borderColor: C.onSurface }}
          >
            <Info size={26} style={{ color: C.secondary }} className="shrink-0" />
            <p className="text-sm">
              <strong>¿Qué no dibujo?</strong> No realizo contenido NSFW explícito, discursos de odio ni estilos hiperrealistas fotográficos. Mi especialidad es street art y estética cómic zine.
            </p>
          </div>
        </div>
      </section>

      {/* COTIZADOR + CONTACTO */}
      <section id="cotizador" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cotizador */}
          <div
            className="lg:col-span-7 p-6 md:p-8 rounded-2xl border-[3px]"
            style={{ backgroundColor: C.surfaceLowest, borderColor: C.onSurface, boxShadow: `6px 6px 0 ${C.onSurface}` }}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2" style={{ borderColor: C.surfaceHigh }}>
              <div className="flex items-center gap-2">
                <Calculator size={22} style={{ color: C.primary }} />
                <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-xl uppercase">
                  Arma tu Mensaje de DM
                </h3>
              </div>
              <span
                className="hidden sm:inline px-2 py-1 rounded text-[10px] font-bold uppercase"
                style={{ backgroundColor: C.surfaceHigh, color: C.onSurfaceVariant }}
              >
                AUTO-GENERADOR
              </span>
            </div>

            <p className="text-sm mb-5" style={{ color: C.onSurfaceVariant }}>
              Selecciona tus preferencias para pre-armar el texto exacto. Al abrir Instagram, el mensaje queda copiado listo para pegar.
            </p>

            {comisiones.length === 0 ? (
              <p className="text-sm font-bold uppercase" style={{ color: C.onSurfaceVariant }}>
                Aún no hay tipos de comisión configurados para cotizar.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">1. Tipo de Comisión</label>
                  <select
                    value={tipoIndex}
                    onChange={(e) => setTipoIndex(Number(e.target.value))}
                    className="w-full p-3 rounded-lg font-medium outline-none cursor-pointer"
                    style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                  >
                    {comisiones.map((c, index) => (
                      <option key={c.id ?? index} value={index}>
                        {c.nombre} — Q{c.precioQ} / ${c.precioUsd}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase">2. Cantidad de personajes</label>
                    <select
                      value={personajes}
                      onChange={(e) => setPersonajes(Number(e.target.value))}
                      className="w-full p-3 rounded-lg font-medium outline-none cursor-pointer"
                      style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                    >
                      {OPCIONES_PERSONAJES.map((o) => (
                        <option key={o.valor} value={o.valor}>
                          {o.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase">3. Uso de la Obra</label>
                    <select
                      value={uso}
                      onChange={(e) => setUso(Number(e.target.value))}
                      className="w-full p-3 rounded-lg font-medium outline-none cursor-pointer"
                      style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                    >
                      {OPCIONES_USO.map((o) => (
                        <option key={o.valor} value={o.valor}>
                          {o.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">4. Breve idea de lo que deseas</label>
                  <input
                    type="text"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ej: Mi personaje con chaqueta cyberpunk y fondo rosa neón"
                    className="w-full p-3 rounded-lg font-medium outline-none"
                    style={{ backgroundColor: C.surfaceLow, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                  />
                </div>

                <div
                  className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ backgroundColor: C.surfaceContainer, boxShadow: `3px 3px 0 ${C.onSurface}` }}
                >
                  <div>
                    <span className="text-xs font-bold uppercase block" style={{ color: C.onSurfaceVariant }}>
                      Estimado preliminar aproximado
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl" style={{ color: C.primary }}>
                        ~Q{estimado.gtq}
                      </span>
                      <span className="font-bold" style={{ color: C.onSurfaceVariant }}>
                        (~${estimado.usd} USD)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopiarMensaje}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase"
                    style={{ backgroundColor: C.surfaceLowest, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                  >
                    {copiado ? <Check size={14} style={{ color: C.primary }} /> : <Copy size={14} />}
                    {copiado ? '¡Copiado!' : 'Copiar Mensaje'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAbrirInstagram}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl border-[2.5px] font-bold uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                  style={{
                    backgroundColor: C.primaryContainer,
                    color: C.onPrimaryContainer,
                    borderColor: C.onSurface,
                    boxShadow: `5px 5px 0 ${C.onSurface}`,
                  }}
                >
                  <Send size={20} />
                  Abrir DM en Instagram con esta idea
                </button>
              </div>
            )}
          </div>

          {/* Contacto */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div
              className="p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden border-[3px]"
              style={{
                backgroundColor: C.primaryContainer,
                color: C.onPrimaryContainer,
                borderColor: C.onSurface,
                boxShadow: `6px 6px 0 ${C.onSurface}`,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase"
                  style={{ backgroundColor: C.surfaceLowest, color: C.onSurface }}
                >
                  <Send size={14} /> INSTAGRAM OFICIAL
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ backgroundColor: C.surfaceLowest, color: C.onSurface }}
                >
                  CANAL PRINCIPAL
                </span>
              </div>

              <div>
                <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl uppercase tracking-tight">
                  {INSTAGRAM_HANDLE}
                </h3>
                <p className="text-sm mt-1 opacity-90">
                  Envíame DM con capturas de mis obras que te gusten, tus bocetos o tu concepto para darte cotización exacta en menos de 24 horas.
                </p>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-sm"
                style={{ backgroundColor: C.surfaceLowest, color: C.onSurface, boxShadow: `4px 4px 0 ${C.onSurface}` }}
              >
                <ArrowRight size={18} /> Abrir perfil {INSTAGRAM_HANDLE}
              </a>
            </div>

            <div
              className="p-5 rounded-2xl flex flex-col gap-2 border-[3px]"
              style={{ backgroundColor: C.surfaceLowest, borderColor: C.onSurface, boxShadow: `5px 5px 0 ${C.onSurface}` }}
            >
              <span className="font-['Bricolage_Grotesque',sans-serif] font-bold uppercase border-b-2 pb-2" style={{ borderColor: C.surfaceHigh }}>
                Otros Canales de Contacto
              </span>

              <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ backgroundColor: C.surfaceLow }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, boxShadow: `2px 2px 0 ${C.onSurface}` }}
                  >
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Correo Electrónico</span>
                    <span className="text-xs" style={{ color: C.onSurfaceVariant }}>{EMAIL}</span>
                  </div>
                </div>
                <a href={`mailto:${EMAIL}`} className="p-2 rounded" style={{ backgroundColor: C.surfaceHigh }}>
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ backgroundColor: C.surfaceLow }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: C.surfaceHighest }}
                  >
                    <Music2 size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">TikTok &amp; Speedpaints</span>
                    <span className="text-xs" style={{ color: C.onSurfaceVariant }}>@daxth1_art</span>
                  </div>
                </div>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="p-2 rounded" style={{ backgroundColor: C.surfaceHigh }}>
                  <ArrowRight size={15} />
                </a>
              </div> */}

              <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ backgroundColor: C.surfaceLow }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#ffd9de', color: '#3f0015' }}
                  >
                    <Images size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Galería &amp; Proyectos</span>
                    <span className="text-xs" style={{ color: C.onSurfaceVariant }}>Ver trabajos anteriores</span>
                  </div>
                </div>
                <Link to="/portafolio" className="p-2 rounded" style={{ backgroundColor: C.surfaceHigh }}>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div
              className="p-4 rounded-xl flex items-center gap-3 border-2"
              style={{ backgroundColor: C.surfaceHigh, borderColor: C.onSurface, boxShadow: `3px 3px 0 ${C.onSurface}` }}
            >
              <ShieldCheck size={26} style={{ color: C.primary }} className="shrink-0" />
              <p className="text-sm">
                <strong>Métodos de Pago Aceptados:</strong> Transferencia bancaria directa (GyT, BAM) y PayPal seguro para comisiones internacionales en USD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div
          className="p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 border-[3px]"
          style={{
            backgroundColor: C.inverseSurface,
            color: C.inverseOnSurface,
            borderColor: C.onSurface,
            boxShadow: `6px 6px 0 ${C.onSurface}`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-['Bricolage_Grotesque',sans-serif] font-extrabold text-lg shrink-0"
              style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer, boxShadow: `3px 3px 0 #ffffff` }}
            >
              DX
            </div>
            <div>
              <h4 className="font-['Bricolage_Grotesque',sans-serif] font-bold uppercase">
                ¿Tienes una idea fuera de lo común?
              </h4>
              <p className="text-sm opacity-80">
                Murales, portadas de zines, diseño para serigrafía en camisetas o skateboards: hablemos directo.
              </p>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm"
            style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, boxShadow: `4px 4px 0 #ffffff` }}
          >
            ¡Hablemos en Instagram! <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}