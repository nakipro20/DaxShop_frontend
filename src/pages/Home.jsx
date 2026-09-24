import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

const API_URL = "https://daxshop-backend.onrender.com";


export default function Home() {

  const [productos, setProductos] = useState([]);
  const [portafolio, setPortafolio] = useState([]);
  const [comisiones, setComisiones] = useState([]);

  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingPortafolio, setLoadingPortafolio] = useState(true);
  const [loadingComisiones, setLoadingComisiones] = useState(true);

  const [errorProductos, setErrorProductos] = useState("");
  const [errorPortafolio, setErrorPortafolio] = useState("");
  const [errorComisiones, setErrorComisiones] = useState("");

  // ==========================================================
  // CONSUMIR PRODUCTOS
  // ==========================================================

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoadingProductos(true);

        const respuesta = await fetch(`${API_URL}/productos`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los productos");
        }

        const resultado = await respuesta.json();

        if (resultado.exito) {
          setProductos(resultado.datos || []);
        } else {
          throw new Error("La API no devolvió los productos correctamente");
        }
      } catch (error) {
        console.error("Error productos:", error);
        setErrorProductos(error.message);
      } finally {
        setLoadingProductos(false);
      }
    };

    obtenerProductos();
  }, []);

  // ==========================================================
  // CONSUMIR PORTAFOLIO
  // ==========================================================

  useEffect(() => {
    const obtenerPortafolio = async () => {
      try {
        setLoadingPortafolio(true);

        const respuesta = await fetch(`${API_URL}/portafolio`);

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el portafolio");
        }

        const resultado = await respuesta.json();

        if (resultado.exito) {
          setPortafolio(resultado.datos || []);
        } else {
          throw new Error("La API no devolvió el portafolio correctamente");
        }
      } catch (error) {
        console.error("Error portafolio:", error);
        setErrorPortafolio(error.message);
      } finally {
        setLoadingPortafolio(false);
      }
    };

    obtenerPortafolio();
  }, []);

  // ==========================================================
  // CONSUMIR COMISIONES
  // ==========================================================

  useEffect(() => {
    const obtenerComisiones = async () => {
      try {
        setLoadingComisiones(true);

        const respuesta = await fetch(`${API_URL}/comisiones`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener las comisiones");
        }

        const resultado = await respuesta.json();

        if (resultado.exito) {
          setComisiones(resultado.datos || []);
        } else {
          throw new Error("La API no devolvió las comisiones correctamente");
        }
      } catch (error) {
        console.error("Error comisiones:", error);
        setErrorComisiones(error.message);
      } finally {
        setLoadingComisiones(false);
      }
    };

    obtenerComisiones();
  }, []);

  // ==========================================================
  // PRODUCTOS DESTACADOS
  // ==========================================================

  const productosDestacados = productos.slice(0, 6);

  // ==========================================================
  // PORTAFOLIO DESTACADO
  // ==========================================================

  const portafolioDestacado = portafolio.slice(0, 3);

  // ==========================================================
  // COMISIONES DESTACADAS
  // ==========================================================

  const comisionesDestacadas = comisiones.slice(0, 4);

  // ==========================================================
  // FORMATEAR FECHA
  // ==========================================================

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    try {
      return new Date(fecha).toLocaleDateString("es-GT", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  // ==========================================================
  // ESTADO DE STOCK
  // ==========================================================

  const obtenerClaseStock = (estado) => {
    if (estado === "Disponible") {
      return "bg-primary-container text-on-primary-container";
    }

    return "bg-surface-container-high text-on-surface";
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* TIRA DE ANUNCIOS SUPERIOR (COMIC TICKER) */}
      {/* overflow-x-auto (en vez de overflow-hidden) + no-scrollbar: en mobile
          el texto no cabe y antes se recortaba silenciosamente; ahora se
          puede deslizar horizontalmente sin mostrar la barra de scroll. */}
      <div className="w-full bg-secondary-container text-on-secondary-container py-space-xs px-gutter-mobile sm:px-gutter border-b-[3px] border-on-surface flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-space-md whitespace-nowrap animate-pulse">
          <span className="font-label-sm text-label-sm uppercase flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-sm"></span> DROPS LIMITADOS 2026
          </span>
          <span className="font-label-sm text-label-sm uppercase hidden md:inline">★ ILUSTRACIÓN URBANA & FANART POP</span>
          <span className="font-label-sm text-label-sm uppercase">★ PEDIDOS DIRECTOS VÍA INSTAGRAM @DAXTH1</span>
          <span className="font-label-sm text-label-sm uppercase hidden lg:inline">★ GUATEMALA</span>
        </div>
      </div>

      {/* HERO SECTION CON ESTÉTICA VIÑETA COMIC */}
      {/* px-gutter-mobile / sm:px-gutter: tu theme ya define un gutter más
          angosto para mobile (spacing-gutter-mobile) que nunca se estaba
          usando; py-space-lg en vez de py-space-xl reduce el aire vertical
          desperdiciado en pantallas cortas, y vuelve a py-space-xl desde lg. */}
      <section className="relative w-full max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-lg lg:py-space-xl flex flex-col gap-space-lg">
        <div className="relative bg-surface-container-lowest border-[3px] border-on-surface rounded-xl shadow-[5px_5px_0_#1a1c1a] sm:shadow-[8px_8px_0_#1a1c1a] p-space-sm sm:p-space-lg lg:p-space-xl overflow-hidden">
          
          {/* Halftone pattern decorativo (simulado con gradiente) */}
          <div className="absolute -right-12 -top-12 w-64 h-64 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#1a1c1a 2px, transparent 2px)', backgroundSize: '10px 10px'}}></div>
          
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md relative z-10">
            <div className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container px-space-sm py-1 border-2 border-on-surface rounded-md shadow-[3px_3px_0_#1a1c1a] transform -rotate-1">
              <span className="material-symbols-outlined text-sm"></span>
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
              
              {/* text-display-mobile en vez de text-display fijo: el theme ya
                  trae este tamaño (40px) pensado justo para esto, solo no se
                  estaba usando. De sm en adelante vuelve al text-display
                  original (56px), igual que en desktop. */}
              <h1 className="font-display text-display-mobile sm:text-display text-on-surface uppercase tracking-tight leading-none">
                ¡ARTE, MERCH & <span className="text-primary bg-primary-fixed px-space-xs border-2 border-on-surface inline-block shadow-[4px_4px_0_#1a1c1a] -rotate-1">ESTILO</span> URBANO!
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Galería y catálogo exclusivo por <strong className="text-on-surface"> (Daxth1)</strong>. Ilustraciones de corte cómic, personajes con actitud, stickers resistentes y streetwear impreso bajo demanda.
              </p>
              
              {/* Badges de valor tipo sticker */}
              <div className="flex flex-wrap gap-space-xs pt-space-xs">
                <span className="bg-surface-container-high border-2 border-on-surface rounded-full px-space-sm py-0.5 font-label-sm text-label-sm shadow-[2px_2px_0_#1a1c1a] transform -rotate-1">💥 Pines & Prints</span>
                <span className="bg-surface-container-high border-2 border-on-surface rounded-full px-space-sm py-0.5 font-label-sm text-label-sm shadow-[2px_2px_0_#1a1c1a] transform rotate-2">🎨 Arte Tradicional & Digital</span>
                <span className="bg-surface-container-high border-2 border-on-surface rounded-full px-space-sm py-0.5 font-label-sm text-label-sm shadow-[2px_2px_0_#1a1c1a] transform -rotate-2">✨ Stickers </span>
              </div>

              {/* CTAs Primarios */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-sm">
                <Link to="/catalogo" className="w-full sm:w-auto justify-center inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg border-[3px] border-on-surface shadow-[5px_5px_0_#1a1c1a] hover:bg-primary hover:text-on-primary hover:shadow-[7px_7px_0_#1a1c1a] hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#1a1c1a] transition-all">
                  <span className="material-symbols-outlined">menu_book</span>
                  <span>VER CATÁLOGO & PRECIOS</span>
                </Link>
                <a href="https://instagram.com/daxth1" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto justify-center inline-flex items-center gap-space-xs bg-surface-container text-on-surface font-label-lg text-label-lg px-space-md py-space-sm rounded-lg border-[2.5px] border-on-surface shadow-[4px_4px_0_#1a1c1a] hover:bg-secondary-container hover:text-on-secondary-container hover:shadow-[5px_5px_0_#1a1c1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
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
                    <div className="w-full h-56 sm:h-72 lg:h-80 bg-gray-200 flex items-center justify-center font-headline-md text-gray-500">
                      <img src="https://drive.google.com/file/d/1LqGvUdHKHvrW7QUoF3VDLgqhfRZdCXwx/view" alt="LOGO DAX" width="100%"/>
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

        {/* =====================================================
          PRODUCTOS
      ====================================================== */}

      <section className="w-full max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-lg">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm border-b-[3px] border-on-surface pb-space-sm mb-space-md">

          <div>

            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">
              CATÁLOGO
            </span>

            {/* text-headline-lg-mobile (28px, ya definido en el theme) en vez
                del text-headline-lg fijo (40px) que se veía enorme en
                celulares angostos; desde lg vuelve al tamaño original. */}
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface uppercase tracking-tight">
              PRODUCTOS DESTACADOS
            </h2>
          </div>

          <Link
            to="/catalogo"
            className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-on-surface transition-colors"
          >
            VER CATÁLOGO COMPLETO

            <span className="material-symbols-outlined text-base">
            </span>
          </Link>
        </div>

        {loadingProductos ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 sm:h-96 rounded-xl bg-surface-container-low animate-pulse border-[3px] border-on-surface"
              />
            ))}

          </div>

        ) : errorProductos ? (

          <div className="p-space-md bg-primary-fixed border-2 border-on-surface rounded-xl">
            <p className="font-body-md text-body-md">
              No fue posible cargar los productos.
            </p>
          </div>

        ) : productosDestacados.length === 0 ? (

          <div className="p-space-lg text-center bg-surface-container-low rounded-xl border-[3px] border-on-surface">
            <span className="material-symbols-outlined text-4xl">
              inventory_2
            </span>

            <p className="font-body-md text-body-md mt-space-xs">
              No hay productos disponibles.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">

            {productosDestacados.map((producto) => (

              <article
                key={producto.id}
                className="bg-surface-container-lowest border-[2.5px] border-on-surface rounded-xl shadow-[5px_5px_0_#1a1c1a] p-space-md flex flex-col justify-between hover:-translate-y-1 transition-all"
              >

                <div>

                  <div className="flex justify-between items-start gap-space-sm mb-space-sm">

                    <span className="px-space-xs py-0.5 font-label-sm text-label-sm border border-on-surface rounded bg-secondary-container text-on-secondary-container">
                      {producto.category_name || "PRODUCTO"}
                    </span>

                    <span
                      className={`px-space-xs py-0.5 font-label-sm text-label-sm border border-on-surface rounded ${obtenerClaseStock(
                        producto.stock_status
                      )}`}
                    >
                      {producto.stock_status}
                    </span>
                  </div>

                  {/* h-44 en mobile (antes h-52 fijo) para que la tarjeta no
                      ocupe tanto scroll vertical en celulares; desde sm vuelve
                      al alto original. */}
                  <div className="w-full h-44 sm:h-52 bg-surface-container-low border-2 border-on-surface rounded-lg overflow-hidden mb-space-sm">

                    {producto.primary_image_url ? (
                      <img
                        src={producto.primary_image_url}
                        alt={producto.title}
                        className="w-full h-full object-cover hover:scale-[1.03] transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl">
                          image
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase">
                    {producto.title}
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-3">
                    {producto.description}
                  </p>

                </div>

                <div className="mt-space-md pt-space-sm border-t border-surface-container-highest">

                  <div className="flex items-center justify-between gap-space-sm">

                    <div className="flex flex-col">

                      <span className="font-headline-sm text-headline-sm text-primary">
                        Q{producto.price_quetzales}
                      </span>

                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        ${producto.price_usd}
                      </span>

                    </div>

                    <Link
                      to={`/catalogo/${producto.id}`}
                      className="inline-flex items-center gap-0.5 font-label-md text-label-md text-primary hover:underline"
                    >
                      Ver producto

                      <span className="material-symbols-outlined text-sm">
                        
                      </span>
                    </Link>

                  </div>
                </div>

              </article>
            ))}

          </div>
        )}
      </section>

      {/* =====================================================
          PORTAFOLIO
      ====================================================== */}

      <section className="w-full bg-surface-container-low border-y-[3px] border-on-surface py-space-lg lg:py-space-xl">

        <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm border-b-[3px] border-on-surface pb-space-sm mb-space-md">

            <div>

              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">
                GALERÍA
              </span>

              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface uppercase">
                PORTAFOLIO
              </h2>

            </div>

            <Link
              to="/portafolio"
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary"
            >
              VER GALERÍA COMPLETA

              <span className="material-symbols-outlined">
                
              </span>
            </Link>

          </div>

          {loadingPortafolio ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 sm:h-96 bg-surface-container-high animate-pulse rounded-xl border-[3px] border-on-surface"
                />
              ))}

            </div>

          ) : errorPortafolio ? (

            <div className="p-space-md bg-primary-fixed border-2 border-on-surface rounded-xl">
              <p className="font-body-md text-body-md">
                No fue posible cargar el portafolio.
              </p>
            </div>

          ) : portafolioDestacado.length === 0 ? (

            <div className="text-center p-space-lg">
              <p className="font-body-md text-body-md">
                No hay trabajos disponibles.
              </p>
            </div>

          ) : (

            /* sm:grid-cols-2 agregado para que tablets angostas / celulares
               grandes en horizontal ya muestren 2 columnas en vez de saltar
               directo de 1 a 3 en md. */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">

              {portafolioDestacado.map((obra) => (

                <article
                  key={obra.id}
                  className="bg-surface-container-lowest border-[3px] border-on-surface rounded-xl overflow-hidden shadow-[5px_5px_0_#1a1c1a]"
                >

                  <div className="h-56 sm:h-64 bg-surface-container-highest border-b-[3px] border-on-surface">

                    {obra.primary_image_url ? (
                      <img
                        src={obra.primary_image_url}
                        alt={obra.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl">
                          image
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="p-space-md">

                    <div className="flex justify-between gap-space-sm mb-space-xs">

                      <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-space-xs py-0.5 rounded border border-on-surface">
                        {obra.category_name || "PORTAFOLIO"}
                      </span>

                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {obra.project_type}
                      </span>

                    </div>

                    <h3 className="font-headline-sm text-headline-sm uppercase">
                      {obra.title}
                    </h3>

                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-3">
                      {obra.description}
                    </p>

                    <div className="mt-space-sm pt-space-xs border-t border-surface-container-highest">

                      <div className="flex justify-between gap-space-sm">

                        <span className="font-label-sm text-label-sm">
                          {obra.technique}
                        </span>

                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {formatearFecha(obra.completion_date)}
                        </span>

                      </div>

                    </div>
                  </div>

                </article>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          COMISIONES
      ====================================================== */}

      <section className="w-full max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-space-lg lg:py-space-xl">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm border-b-[3px] border-on-surface pb-space-sm mb-space-md">

          <div>

            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">
              SERVICIOS
            </span>

            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface uppercase">
              COMISIONES
            </h2>

          </div>

          <Link
            to="/comisiones"
            className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary"
          >
            VER TODAS LAS COMISIONES
          </Link>

        </div>

        {loadingComisiones ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 sm:h-96 bg-surface-container-high animate-pulse rounded-xl border-[3px] border-on-surface"
              />
            ))}

          </div>

        ) : errorComisiones ? (

          <div className="p-space-md bg-primary-fixed border-2 border-on-surface rounded-xl">
            <p className="font-body-md text-body-md">
              No fue posible cargar las comisiones.
            </p>
          </div>

        ) : comisionesDestacadas.length === 0 ? (

          <div className="text-center p-space-lg">
            <p className="font-body-md text-body-md">
              No hay servicios de comisión disponibles.
            </p>
          </div>

        ) : (

          /* md:grid-cols-3 agregado como paso intermedio para tablets antes
             de saltar a 4 columnas en pantallas grandes (lg). */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">

            {comisionesDestacadas.map((comision) => (

              <article
                key={comision.id}
                className="bg-surface-container-lowest border-[3px] border-on-surface rounded-xl overflow-hidden shadow-[5px_5px_0_#1a1c1a] flex flex-col"
              >

                <div className="h-40 sm:h-48 bg-surface-container-highest border-b-[3px] border-on-surface">

                  {comision.cover_image_url ? (
                    <img
                      src={comision.cover_image_url}
                      alt={comision.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl">
                        palette
                      </span>
                    </div>
                  )}

                </div>

                <div className="p-space-md flex flex-col flex-1">

                  <h3 className="font-headline-sm text-headline-sm uppercase">
                    {comision.name}
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs line-clamp-4">
                    {comision.description}
                  </p>

                  <div className="mt-auto pt-space-md">

                    <div className="flex items-end justify-between gap-space-sm">

                      <div>

                        <span className="font-headline-sm text-headline-sm text-primary block">
                          Q{comision.base_price_quetzales}
                        </span>

                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          ${comision.base_price_usd}
                        </span>

                      </div>

                      <span className="font-label-sm text-label-sm text-right">
                        {comision.estimated_time}
                      </span>

                    </div>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}
      </section>

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
      <section className="w-full bg-surface-container-low border-t-[3px] border-on-surface py-space-lg lg:py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter flex flex-col gap-space-lg">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-space-xs">
            <div className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container px-space-sm py-0.5 rounded border border-on-surface font-label-sm text-label-sm uppercase">
              GUÍA RÁPIDA EN 3 PASOS
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface uppercase">
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
                Coordinamos pago seguro (transferencia bancaria local en Guatemala o PayPal para comisiones internacionales) y acordamos entrega personal o envío por paquetería rastreada <b>GUATEMALA</b>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}