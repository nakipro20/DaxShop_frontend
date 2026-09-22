import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import api from '../services/api';

export default function Comisiones() {
  const [comisiones, setComisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerComisiones = async () => {
      try {
        const respuesta = await api.get('/comisiones');
        setComisiones(respuesta.data.datos);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la información de comisiones.');
      } finally {
        setCargando(false);
      }
    };
    obtenerComisiones();
  }, []);

  if (cargando) return <div className="text-center py-20 font-bold text-xl uppercase">Cargando tarifas...</div>;
  if (error) return <div className="text-center py-20 font-bold text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 mb-4">Encargos y Comisiones</h2>
      <p className="mb-8 text-gray-700 font-medium">
        Cotiza tu pieza de arte personalizada. Revisa los estilos disponibles y contáctame directamente para agendar tu cupo.
      </p>

      {comisiones.length === 0 ? (
        <div className="bg-gray-100 border-4 border-black p-10 text-center font-bold uppercase">
          No hay información de comisiones por el momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comisiones.map((comision) => (
            <div key={comision.id} className="border-4 border-black bg-white flex flex-col h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              
              {/* Imagen de referencia */}
              <div className="aspect-[4/3] bg-gray-100 border-b-4 border-black overflow-hidden flex items-center justify-center">
                {comision.cover_image_url ? (
                  <img src={comision.cover_image_url} alt={comision.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 font-bold uppercase text-sm">Sin imagen</span>
                )}
              </div>

              {/* Contenido */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-black text-2xl uppercase leading-tight mb-2">{comision.name}</h3>
                <p className="text-sm text-gray-600 flex-1 mb-4">{comision.description}</p>

                <div className="bg-gray-100 border-2 border-black p-3 mb-4">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Precio Base</div>
                  <div className="font-black text-xl">Q{comision.base_price_quetzales} <span className="text-sm font-bold text-gray-500">({comision.base_price_usd} USD)</span></div>
                </div>

                <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-600 mb-4">
                  <span>Tiempo aprox:</span>
                  <span>{comision.estimated_time}</span>
                </div>

                {/* Botón de Contacto (Puedes cambiar el href por el link de Instagram real) */}
                <a 
                  href="https://instagram.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto bg-black text-white px-4 py-3 font-bold uppercase flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <MessageCircle size={18} /> Cotizar este estilo
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}