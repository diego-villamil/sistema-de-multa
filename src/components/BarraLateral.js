import React from 'react';

const BarraLateral = ({ userName, userEmail, role, onLogout, onSectionChange }) => {
  // Definir las opciones disponibles
  const opciones = [
    { label: 'Ver Cámaras', section: 'ver' },
    { label: 'Subir Video', section: 'video' },
    { label: 'Ver Infracciones', section: 'infracciones' },
    { label: 'Vehículos Detectados', section: 'vehiculos' },
  ];

  // Agregar la opción de Registrar Cámara y Asignar Cámaras solo si el rol es Administrador
  if (role.toLowerCase() === 'administrador') {
    opciones.push(
      { label: 'Registrar Cámara', section: 'registrar' },
      { label: 'Asignar Cámaras', section: 'asignar' }  // Corregido a 'asignar' para que coincida con la lógica
    );
  }

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4">Bienvenido, {userName}</h1>
      <p className="mb-4">{role}</p>
      <p>{userEmail}</p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Opciones</h2>
        
        {/* Mapeamos las opciones dinámicamente */}
        {opciones.map((opcion) => (
          <button 
            key={opcion.section}
            onClick={() => onSectionChange(opcion.section)}  // Enviamos la opción correspondiente
            className="block mb-2 text-gray-300 hover:text-white"
          >
            {opcion.label}
          </button>
        ))}
      </div>

      <button 
        onClick={onLogout} 
        className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default BarraLateral;
