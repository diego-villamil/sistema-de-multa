import React, { useState, useEffect } from 'react';

// Componente de modal reutilizable
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Botón para cerrar el modal, con posición absoluta */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          X
        </button>

        {children}
      </div>
    </div>
  );
};

function AsignarCamaras() {
  const [camaras, setCamaras] = useState([]); // Para almacenar las cámaras
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [formData, setFormData] = useState({
    camaraId: '',
    usuarioId: ''
  }); // Estado para los datos del formulario

  // Simulación de la petición para obtener la información de las cámaras
  useEffect(() => {
    const fetchCamaras = async () => {
      const response = await fetch('http://localhost:5000/api/camaras');
      const data = await response.json();
      if (data.status === 'success') {
        setCamaras(data.camaras); // Almacena las cámaras en el estado
      }
    };

    fetchCamaras();
  }, []);

  // Función para manejar el envío del formulario
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para asignar la cámara
    console.log('Datos del formulario:', formData);
    setIsModalOpen(false); // Cerrar el modal después de enviar el formulario
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Asignar Cámaras</h2>

      {/* Botón para abrir el modal */}
      <div className="mb-4 text-right">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Asignar Cámara
        </button>
      </div>

      {/* Tabla de cámaras */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-6 py-3 border-b border-gray-300">ID</th>
            <th className="px-6 py-3 border-b border-gray-300">Nombre</th>
            <th className="px-6 py-3 border-b border-gray-300">Usuarios Asignados</th>
            <th className="px-6 py-3 border-b border-gray-300">Acción</th>
          </tr>
        </thead>
        <tbody>
          {camaras.map((camara) => (
            <tr key={camara.id} className="hover:bg-gray-50">
              <td className="px-6 py-3 border-b border-gray-200">{camara.id}</td>
              <td className="px-6 py-3 border-b border-gray-200">{camara.nombre}</td>
              <td className="px-6 py-3 border-b border-gray-200">{camara.usuarios.join(', ')}</td>
              <td className="px-6 py-3 border-b border-gray-200">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => alert(`Ver cámara ID: ${camara.id}`)}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de asignación */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Asignar Usuario a Cámara</h3>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="camaraId" className="block text-gray-700">Selecciona la cámara</label>
            <select
              id="camaraId"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.camaraId}
              onChange={(e) => setFormData({ ...formData, camaraId: e.target.value })}
              required
            >
              <option value="">Seleccione una cámara</option>
              {camaras.map((camara) => (
                <option key={camara.id} value={camara.id}>
                  {camara.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="usuarioId" className="block text-gray-700">Selecciona el usuario</label>
            <input
              id="usuarioId"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.usuarioId}
              onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
              placeholder="ID del usuario"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Asignar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AsignarCamaras;
