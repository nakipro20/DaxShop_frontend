import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const resultado = await login(email, password);
    
    if (resultado.exito) {
      navigate('/admin/dashboard'); // Si entra, lo mandamos al panel
    } else {
      setError(resultado.mensaje);
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="flex justify-center mb-6">
          <div className="bg-black text-white p-4 rounded-full">
            <Lock size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-black uppercase text-center mb-6">Acceso CMS</h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-6 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold uppercase text-sm mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-black p-3 font-medium outline-none focus:bg-gray-100 transition-colors"
              placeholder="admin@daxshop.com"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-sm mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-black p-3 font-medium outline-none focus:bg-gray-100 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-black text-white font-black uppercase py-4 mt-4 hover:bg-gray-800 active:translate-y-1 transition-all disabled:bg-gray-400"
          >
            {cargando ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

      </div>
    </div>
  );
}