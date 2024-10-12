import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';

const BarraLateral = ({ role, options }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
 // Aquí puedes obtener el ID de usuario desde el contexto o almacenamiento local

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/1`);
        const data = await response.json();
    
        if (data.status === 'success') {
          setUserName(data.data.nombre);
          setUserEmail(data.data.email);
        } else {
          console.error('Error al obtener la información del usuario:', data.message);
        }
      } catch (error) {
        console.error('Error al hacer la petición:', error);
      }
    };
    
    fetchUserInfo();
  }, []);

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
                  <span className="mr-2">{option.icon}</span> {option.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Botón de Cerrar Sesión */}
      <div className="p-6">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default BarraLateral;
