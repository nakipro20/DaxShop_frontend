import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisamos si hay un token guardado
    const tokenGuardado = localStorage.getItem('daxshop_token');
    const usuarioGuardado = localStorage.getItem('daxshop_usuario');

    if (tokenGuardado && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      // Le decimos a Axios que incluya este token en todas las peticiones futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenGuardado}`;
    }
    setCargando(false);
  }, []);

  const login = async (email, password) => {
    try {
      const respuesta = await api.post('/auth/login', { email, password });
      
      const { token, usuario: datosUsuario } = respuesta.data;
      
      // Guardar en el navegador
      localStorage.setItem('daxshop_token', token);
      localStorage.setItem('daxshop_usuario', JSON.stringify(datosUsuario));
      
      // Actualizar el estado global y Axios
      setUsuario(datosUsuario);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { exito: true };
    } catch (error) {
      return { 
        exito: false, 
        mensaje: error.response?.data?.mensaje || 'Error de conexión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('daxshop_token');
    localStorage.removeItem('daxshop_usuario');
    delete api.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  if (cargando) return <div>Cargando sistema...</div>;

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}