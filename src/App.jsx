import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Portafolio from './pages/Portafolio';
import Comisiones from './pages/Comisiones';
import Login from './pages/admin/Login'; 
import RutaProtegida from './components/RutaProtegida';
import Dashboard from './pages/admin/Dashboard';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPortafolio from './pages/admin/AdminPortafolio';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
          <main className="w-full pt-20 bg-surface min-h-screen">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<ProductoDetalle />} />
            <Route path="/portafolio" element={<Portafolio />} />
            <Route path="/comisiones" element={<Comisiones />} />
            
            {/* RUTA DEL ADMIN */}
            <Route path="/admin/login" element={<Login />} />
            
            <Route path="/admin/dashboard" element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            } />

            <Route path="/admin/productos" element={
              <RutaProtegida>
                <AdminProductos />
              </RutaProtegida>
            } />

            <Route path="/admin/portafolio" element={
              <RutaProtegida>
                <AdminPortafolio />
              </RutaProtegida>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;