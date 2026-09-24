import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  // Función para determinar las clases activas en el menú (estilo de tu diseño original)
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'px-space-md py-space-xs rounded-lg font-label-lg transition-all bg-primary-container text-on-primary-container border-2 border-on-surface shadow-[2px_2px_0_#1a1c1a]'
      : 'px-space-md py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-all';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b-[3px] border-on-surface shadow-[0_4px_0_#1a1c1a]">
      <div className="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-md">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-space-sm group">
          <div className="p-space-xs bg-secondary-container border-2 border-on-surface rounded-lg shadow-[2px_2px_0_#1a1c1a] transform group-hover:-rotate-3 transition-transform">
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <span className="font-headline-md text-headline-md text-on-surface tracking-wider uppercase">DAXSHOP</span>
            </NavLink>
          </div>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="hidden lg:flex items-center gap-space-sm">
          <NavLink to="/" className={navLinkClass}>INICIO</NavLink>
          <NavLink to="/catalogo" className={navLinkClass}>CATÁLOGO & PRECIOS</NavLink>
          <NavLink to="/portafolio" className={navLinkClass}>PORTAFOLIO</NavLink>
          <NavLink to="/comisiones" className={navLinkClass}>COMISIONES & CONTACTO</NavLink>
          <NavLink to="/admin/dashboard" className={navLinkClass}>PANEL CMS</NavLink>
        </nav>

        {/* BOTÓN INSTAGRAM Y PERFIL */}
        <div className="flex items-center gap-space-sm">
          <a 
            href="https://instagram.com/daxth1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container font-label-lg text-label-lg px-space-md py-space-xs rounded-lg border-[2.5px] border-on-surface shadow-[3px_3px_0_#1a1c1a] hover:bg-primary hover:text-on-primary hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1a1c1a] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span className="hidden sm:inline">PEDIR VÍA IG (@daxth1)</span>
            <span className="sm:hidden">IG @daxth1</span>
          </a>
          
          <img 
            alt="Profile Daxth1" 
            className="w-8 h-8 rounded-full border-2 border-on-surface object-cover" 
            src="https://res.cloudinary.com/bj57ntbk/image/upload/v1790227992/image.png"
          />
        </div>

      </div>
    </header>
  );
}