import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Petición al servidor para cerrar sesión
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',  // Enviar cookies de sesión
      });

      if (response.ok) {
        console.log("Logout exitoso");
      } else {
        console.error("Error en el logout");
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    }

    // Limpiar el localStorage
    localStorage.clear();
    navigate('/login');  // Redirigir al login
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-sm font-semibold text-white"
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
