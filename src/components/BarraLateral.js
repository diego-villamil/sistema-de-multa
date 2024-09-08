import React from 'react';
import { useNavigate } from 'react-router-dom';

const BarraLateral = ({ role, options, userName, userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');  // Eliminar la información de la sesión
    navigate('/login');  // Redirigir al login
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{role}</h2>
        {/* Información del Usuario */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{userName}</h3>
          <p className="text-sm">{userEmail}</p>
        </div>
        {/* Menú de Opciones */}
        <nav>
          <ul>
            <li className="mb-4">
              <button className="w-full text-left text-sm font-semibold hover:bg-gray-700 p-2 rounded">
                Editar Perfil
              </button>
            </li>
            {options.map((option) => (
              <li key={option.name} className="mb-4">
                <button className="w-full text-left text-sm font-semibold hover:bg-gray-700 p-2 rounded">
                  {option.icon} {option.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Botón de Cerrar Sesión */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-sm font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default BarraLateral;
