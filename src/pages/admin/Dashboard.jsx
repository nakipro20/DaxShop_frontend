import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Package, Image as ImageIcon, Palette, ArrowUpRight } from 'lucide-react';

// Colores tomados del design system del mockup DaxShop CMS.
// Si tu tailwind.config.js ya define estos tokens, puedes cambiar estos hex por clases.
const C = {
  primary: '#b8004c',
  primaryContainer: '#de2263',
  onPrimaryContainer: '#fffbff',
  secondaryContainer: '#fe7b25',
  onSecondaryContainer: '#5f2600',
  tertiaryContainer: '#7e707b',
  onTertiaryContainer: '#fffbff',
  surface: '#faf9f6',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f4f3f1',
  surfaceHigh: '#e9e8e5',
  surfaceHighest: '#e3e2e0',
  onSurface: '#1a1c1a',
  onSurfaceVariant: '#5a4044',
};

export default function Dashboard() {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <div className="font-['Rubik',sans-serif]" style={{ color: C.onSurface }}>
      {/* Encabezado del Panel */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-xl p-5 mb-8 gap-4"
        style={{ backgroundColor: C.surfaceLowest, boxShadow: `4px 4px 0 ${C.onSurface}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: C.primary, boxShadow: `3px 3px 0 ${C.onSurface}`, transform: 'rotate(-2deg)' }}
          >
            <span className="text-white font-extrabold text-lg">DAX</span>
          </div>
          <div>
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl leading-tight uppercase tracking-tight">
              Panel de Control
            </h2>
            <p className="text-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>
              Bienvenido, <span className="font-bold" style={{ color: C.onSurface }}>{usuario?.username}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold uppercase text-sm transition-transform hover:-rotate-1 active:translate-x-[2px] active:translate-y-[2px]"
          style={{
            backgroundColor: C.surfaceHigh,
            color: C.onSurface,
            boxShadow: `3px 3px 0 ${C.onSurface}`,
          }}
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>

      {/* Tarjetas de Navegación del CMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/productos"
          className="group rounded-xl p-8 flex flex-col transition-transform hover:-translate-y-1"
          style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
        >
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-colors"
            style={{
              backgroundColor: C.primaryContainer,
              color: C.onPrimaryContainer,
              boxShadow: `2px 2px 0 ${C.onSurface}`,
            }}
          >
            <Package size={32} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl uppercase tracking-tight">
              Catálogo
            </h3>
            <ArrowUpRight
              size={20}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: C.primary }}
            />
          </div>
          <p className="font-medium" style={{ color: C.onSurfaceVariant }}>
            Sube nuevos stickers, prints, edita precios y gestiona el inventario de tu mercancía.
          </p>
        </Link>

        <Link
          to="/admin/portafolio"
          className="group rounded-xl p-8 flex flex-col transition-transform hover:-translate-y-1"
          style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
        >
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-colors"
            style={{
              backgroundColor: C.secondaryContainer,
              color: C.onSecondaryContainer,
              boxShadow: `2px 2px 0 ${C.onSurface}`,
            }}
          >
            <ImageIcon size={32} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl uppercase tracking-tight">
              Portafolio
            </h3>
            <ArrowUpRight
              size={20}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: C.secondaryContainer }}
            />
          </div>
          <p className="font-medium" style={{ color: C.onSurfaceVariant }}>
            Publica tus nuevas piezas de arte, asigna técnicas, categorías y fechas de creación.
          </p>
        </Link>

        <Link
          to="/admin/comisiones"
          className="group rounded-xl p-8 flex flex-col transition-transform hover:-translate-y-1"
          style={{ backgroundColor: C.surfaceLowest, boxShadow: `5px 5px 0 ${C.onSurface}` }}
        >
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-colors"
            style={{
              backgroundColor: C.tertiaryContainer,
              color: C.onTertiaryContainer,
              boxShadow: `2px 2px 0 ${C.onSurface}`,
            }}
          >
            <Palette size={32} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-2xl uppercase tracking-tight">
              Comisiones
            </h3>
            <ArrowUpRight
              size={20}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: C.tertiaryContainer }}
            />
          </div>
          <p className="font-medium" style={{ color: C.onSurfaceVariant }}>
            Administra los tipos de comisión que aceptas y sus precios base.
          </p>
        </Link>
      </div>
    </div>
  );
}