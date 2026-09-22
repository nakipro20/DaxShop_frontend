import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      
      {/* TIRA DE ANUNCIOS SUPERIOR (COMIC TICKER) */}
      <div className="w-full bg-secondary-container text-on-secondary-container py-space-xs px-gutter border-b-[3px] border-on-surface flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-space-md whitespace-nowrap animate-pulse">
          <span className="font-label-sm text-label-sm uppercase flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-sm">bolt</span> DROPS LIMITADOS 2026
          </span>
          <span className="font-label-sm text-label-sm uppercase hidden md:inline">★ ILUSTRACIÓN URBANA & FANART POP</span>
          <span className="font-label-sm text-label-sm uppercase">★ PEDIDOS DIRECTOS VÍA INSTAGRAM @DAXTH1</span>
          <span className="font-label-sm text-label-sm uppercase hidden lg:inline">★ GUATEMALA & ENVIOS INTERNACIONALES</span>
        </div>
      </div>

      {/* HERO SECTION CON ESTÉTICA VIÑETA COMIC */}
      <section className="relative w-full max-w-7xl mx-auto px-gutter py-space-xl lg:py-space-xl flex flex-col gap-space-lg">
        <div className="relative bg-surface-container-lowest border-[3px] border-on-surface rounded-xl shadow-[8px_8px_0_#1a1c1a] p-space-md sm:p-space-lg lg:p-space-xl overflow-hidden">
          
          {/* Halftone pattern decorativo (simulado con gradiente) */}
          <div className="absolute -right-12 -top-12 w-64 h-64 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#1a1c1a 2px, transparent 2px)', backgroundSize: '10px 10px'}}></div>
          
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md relative z-10">
            <div className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container px-space-sm py-1 border-2 border-on-surface rounded-md shadow-[3px_3px_0_#1a1c1a] transform -rotate-1">
              <span className="material-symbols-outlined text-sm">palette</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">TIENDA OFICIAL & PORTAFOLIO</span>
            </div>
            <div className="inline-flex items-center gap-space-xs bg-surface-container-high text-on-surface px-space-sm py-1 border-2 border-on-surface rounded shadow-[2px_2px_0_#1a1c1a]">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
              <span className="font-label-sm text-label-sm">STOCK DISPONIBLE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
            {/* Columna Izquierda: Título y Copys */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="self-start relative bg-secondary-container text-on-secondary-container px-space-sm py-1 rounded border-2 border-on-surface shadow-[3px_3px_0_#1a1c1a] transform rotate-1 mb-space-xs">
                <span className="font-label-lg text-label-lg tracking-wide uppercase">¡100% ARTE AUTÉNTICO & STREET STYLE!</span>
              </div>
              
              <h1 className="font-display text-display text-on-surface uppercase tracking-tight leading-none">
                ¡ARTE, MERCH & <span className="text-primary bg-primary-fixed px-space-xs border-2 border-on-surface inline-block shadow-[4px_4px_0_#1a1c1a] -rotate-1">ESTILO</span> URBANO!
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Galería y catálogo exclusivo por <strong className="text-on-surface">Jenifer Rodas (Daxth1)</strong>. Ilustraciones de corte cómic, personajes con actitud, stickers resistentes y streetwear impreso bajo demanda.
              </p>
              
              {/* Badges de valor tipo sticker */}
              <div className="flex flex-wrap gap-space-xs pt-space-xs">
                <span className="bg-surface-container-high border-2 border-on-surface rounded-full px-space-sm py-0.5 font-label-sm text-label-sm shadow-[2px_2px_0_#1a1c1a] transform -rotate-1">💥 Zines & Prints</span>
                <span className="bg-surface-container-high border-2 border-on-surface rounded-full px-space-sm py-0.5 font-label-sm text-label-sm shadow-[2px_2px_0_#1a1c1a] transform rotate-2">🎨 Arte Tradicional & Digital</span>
                <span className="bg-surface-container-high border-2 border-on-surface rounded-full px-space-sm py-0.5 font-label-sm text-label-sm shadow-[2px_2px_0_#1a1c1a] transform -rotate-2">✨ Stickers Troquelados</span>
              </div>

              {/* CTAs Primarios */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-sm">
                <Link to="/catalogo" className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg border-[3px] border-on-surface shadow-[5px_5px_0_#1a1c1a] hover:bg-primary hover:text-on-primary hover:shadow-[7px_7px_0_#1a1c1a] hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#1a1c1a] transition-all">
                  <span className="material-symbols-outlined">menu_book</span>
                  <span>VER CATÁLOGO & PRECIOS</span>
                </Link>
                <a href="https://instagram.com/daxth1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-space-xs bg-surface-container text-on-surface font-label-lg text-label-lg px-space-md py-space-sm rounded-lg border-[2.5px] border-on-surface shadow-[4px_4px_0_#1a1c1a] hover:bg-secondary-container hover:text-on-secondary-container hover:shadow-[5px_5px_0_#1a1c1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                  <span className="material-symbols-outlined text-primary">chat</span>
                  <span>PEDIR EN IG @DAXTH1</span>
                </a>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta / Portada Visual de Daxth1 */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              <div className="w-full relative group">
                <div className="absolute inset-0 bg-secondary-container rounded-xl transform rotate-2 border-[3px] border-on-surface"></div>
                <div className="relative bg-surface-container-lowest border-[3px] border-on-surface rounded-xl shadow-[6px_6px_0_#1a1c1a] p-space-sm transform -rotate-1 group-hover:rotate-0 transition-transform">
                  <div className="bg-surface-container-highest border-2 border-on-surface rounded-lg overflow-hidden relative">
                    {/* Reemplaza esta URL con tu imagen principal real si la tienes alojada en otro lado */}
                    <div className="w-full h-80 bg-gray-200 flex items-center justify-center font-headline-md text-gray-500">
                      <img src="https://lh3.googleusercontent.com/aida/AEtjO1Ww3rAcvXgvPAseie2czbNZk5iAOp8msAFY_IzyBxriHioeUQFsiUXVEUMildhZmCKHA6lRJbouXxtwZgANIJNd8Sif_Gq06mX1jBrbTdxmkILIyFxFlq3xx2ghU37CHjd2Al2vlsGRBHvWyQMosGypea1mpC2-4u6h5x2LeCEeiMtOTKIokI7OOw3VPi5aF0ZxPHLg0PrhD4T_kEI1zvu_FD2OLGf5IX8TIY7AFP5m1UiXoXxcdaSFqYymhnejyxIH_86DVswQow" alt="LOGO DAX" width="100%"/>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-primary text-on-primary px-space-sm py-0.5 font-label-sm text-label-sm border-2 border-on-surface rounded shadow-[2px_2px_0_#1a1c1a]">
                      FICHA OFICIAL #01
                    </div>
                  </div>
                  <div className="mt-space-sm flex items-center justify-between px-space-xs">
                    <div>
                      <span className="font-headline-sm text-headline-sm text-on-surface block">DAXTH1 STUDIO</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Jenifer Rodas · Visual Artist</span>
                    </div>
                    <div className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-space-xs py-0.5 border border-on-surface rounded">
                      2026 ART DROP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BANNER DE AVISO DIRECTO: CÓMO SE COMPRA */}
        <div className="w-full bg-primary-fixed border-[3px] border-on-surface rounded-xl shadow-[5px_5px_0_#1a1c1a] p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container border-2 border-on-surface shadow-[2px_2px_0_#1a1c1a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase flex items-center gap-space-xs">
                ¡SIN CARRITO AUTOMÁTICO! TRATO DIRECTO CON LA ARTISTA
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Navega el catálogo, anota los nombres o toma captura de pantalla de tus piezas favoritas y envíamelas por mensaje directo en Instagram (<strong className="text-on-surface">@daxth1</strong>) para confirmar stock, envíos y pagos directos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: CÓMO COMPRAR EN DAXSHOP (3 PASOS COMIC STRIP) */}
      <section className="w-full bg-surface-container-low border-t-[3px] border-on-surface py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col gap-space-lg">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-space-xs">
            <div className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container px-space-sm py-0.5 rounded border border-on-surface font-label-sm text-label-sm uppercase">
              GUÍA RÁPIDA EN 3 PASOS
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase">
              ¿CÓMO COMPRAR EN DAXSHOP?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Paso 1 */}
            <div className="relative bg-surface-container-lowest border-[3px] border-on-surface rounded-xl shadow-[6px_6px_0_#1a1c1a] p-space-md flex flex-col items-start gap-space-sm transform hover:-rotate-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container border-2 border-on-surface shadow-[3px_3px_0_#1a1c1a] flex items-center justify-center font-headline-md text-headline-md">1</div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase">ELIGE TUS PIEZAS</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Entra a la sección de <strong className="text-on-surface">Catálogo & Precios</strong>. Anota los nombres, cantidades o toma capturas de pantalla de los stickers, prints o pines que quieras adquirir.
              </p>
            </div>
            {/* Paso 2 */}
            <div className="relative bg-surface-container-lowest border-[3px] border-on-surface rounded-xl shadow-[6px_6px_0_#1a1c1a] p-space-md flex flex-col items-start gap-space-sm transform hover:rotate-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container border-2 border-on-surface shadow-[3px_3px_0_#1a1c1a] flex items-center justify-center font-headline-md text-headline-md">2</div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase">MÁNDAME UN DM</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Escríbeme por Instagram a <strong className="text-on-surface">@daxth1</strong> con tus capturas. Te confirmaré disponibilidad inmediata o tiempo de preparación si es una comisión a medida.
              </p>
            </div>
            {/* Paso 3 */}
            <div className="relative bg-surface-container-lowest border-[3px] border-on-surface rounded-xl shadow-[6px_6px_0_#1a1c1a] p-space-md flex flex-col items-start gap-space-sm transform hover:-rotate-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface border-2 border-on-surface shadow-[3px_3px_0_#1a1c1a] flex items-center justify-center font-headline-md text-headline-md">3</div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase">PAGO Y ENTREGA</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Coordinamos pago seguro (transferencia bancaria local en Guatemala o PayPal para compras internacionales) y acordamos entrega personal o envío por paquetería rastreada.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}