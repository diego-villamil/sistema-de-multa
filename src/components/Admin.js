import React, { useState } from 'react';
import RegistrarCamaras from './RegistrarCamaras';
import VerCamaras from './VerCamaras';
import SubirVideo from './SubirVideo';
import VerInfracciones from './VerInfracciones';
import VerVehiculos from './VerVehiculos';
import AsignarCamaras from './AsignarCamaras';

const Admin = () => {
  const [contenidoActivo, setContenidoActivo] = useState(null);

  const adminOptions = [
    { name: 'Registrar Cámara', icon: '📷', component: <RegistrarCamaras /> },
    { name: 'Ver Cámara', icon: '🎥', component: <VerCamaras />  },
    { name: 'Subir Video', icon: '📹', component: <SubirVideo /> },
    { name: 'Ver Infracciones', icon: '🚨', component: <VerInfracciones /> },
    { name: 'Ver Vehículos', icon: '🚗', component: <VerVehiculos /> },
    { name: 'Asignar Cámaras', icon: '🎥', component: <AsignarCamaras /> },
  ];

  const handleOptionClick = (option) => {
    setContenidoActivo(option.component);
  };

  return (
    <div className="bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administrador</h1>

      {contenidoActivo ? (
        contenidoActivo
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminOptions.map((option) => (
            <div
              key={option.name}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              <span className="text-4xl mb-2">{option.icon}</span>
              <h3 className="text-lg font-semibold">{option.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;