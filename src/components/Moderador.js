import React from 'react';
import BarraLateral from './BarraLateral';

const Moderador = () => {
  const moderadorOptions = [
    { name: 'Ver Cámaras Registradas', icon: '🎥' },
    { name: 'Ver Grabaciones Capturadas', icon: '📹' },
  ];

  return (
    <div className="flex min-h-screen">
      <BarraLateral 
        role="Moderador"
        options={moderadorOptions}
      />

      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Moderador</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {moderadorOptions.map((option) => (
            <div
              key={option.name}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center"
            >
              <span className="text-4xl mb-2">{option.icon}</span>
              <h3 className="text-lg font-semibold">{option.name}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Moderador;
