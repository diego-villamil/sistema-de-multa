import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();  // Limpia todo el localStorage
    navigate('/login');  // Redirige al login
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