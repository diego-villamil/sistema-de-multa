import React, { useState, useEffect } from 'react';

function VerCamaras() {
    const [camaras, setCamaras] = useState([]);

    // Simulación de la petición para obtener la información de las cámaras
    useEffect(() => {
        // Aquí reemplaza con tu API real
        const fetchCamaras = async () => {
            const response = await fetch('http://localhost:5000/api/camaras');  // Ruta para obtener las cámaras
            const data = await response.json();
            if (data.status === 'success') {
                setCamaras(data.camaras);  // Asume que data.camaras es un array con la info de las cámaras
            }
        };

        fetchCamaras();
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Cámaras Asignadas</h2>

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
        </div>
    );
}

export default VerCamaras;
