import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.status === 'success') {
        const { rol, id } = response.data;  // Obtener rol e id del usuario
        console.log("Rol del usuario:", rol);
        console.log("ID del usuario:", id);

        // Guardar el rol e id del usuario en localStorage
        localStorage.setItem('userRole', rol);
        localStorage.setItem('userId', id);  // Almacenar el id del usuario
        setUserRole(rol);  // Actualizar el estado en AppRoutes
        
        // Redireccionar según el rol
        if (rol === 'admin') {
          navigate('/admin');
        } else if (rol === 'moderador') {
          navigate('/moderador');
        } else {
          setError('Rol no reconocido');
        }
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('Error en el servidor');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ingrese su correo"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ingrese su contraseña"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
