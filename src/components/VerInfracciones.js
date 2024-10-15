import React, { useState, useEffect } from 'react';

function VerInfracciones() {
    const [infracciones, setInfracciones] = useState([]);

    // Simulación de la petición para obtener la información de las infracciones
    useEffect(() => {
        // Aquí reemplaza con tu API real
        const fetchInfracciones = async () => {
            const response = await fetch('http://localhost:5000/api/infracciones');  // Ruta para obtener las infracciones
            const data = await response.json();
            if (data.status === 'success') {
                setInfracciones(data.infracciones);  // Asume que data.infracciones es un array con la info de las infracciones
            }
        };

        fetchInfracciones();
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Infracciones Detectadas</h2>

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-6 py-3 border-b border-gray-300">ID</th>
                        <th className="px-6 py-3 border-b border-gray-300">Placa</th>
                        <th className="px-6 py-3 border-b border-gray-300">Velocidad</th>
                        <th className="px-6 py-3 border-b border-gray-300">Fecha</th>
                        <th className="px-6 py-3 border-b border-gray-300">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {infracciones.map((infraccion) => (
                        <tr key={infraccion.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 border-b border-gray-200">{infraccion.id}</td>
                            <td className="px-6 py-3 border-b border-gray-200">{infraccion.placa}</td>
                            <td className="px-6 py-3 border-b border-gray-200">{infraccion.velocidad} km/h</td>
                            <td className="px-6 py-3 border-b border-gray-200">{infraccion.fecha}</td>
                            <td className="px-6 py-3 border-b border-gray-200">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    onClick={() => alert(`Ver infracción ID: ${infraccion.id}`)}
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

export default VerInfracciones;
