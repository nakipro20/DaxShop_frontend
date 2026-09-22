import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RutaProtegida({ children }) {
  const { usuario } = useContext(AuthContext);

  // Si no hay un usuario logueado, lo pateamos de vuelta al login
  if (!usuario) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si está logueado, lo dejamos pasar al contenido (children)
  return children;
}