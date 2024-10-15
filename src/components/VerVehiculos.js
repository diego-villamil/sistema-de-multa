import React, { useState, useEffect } from 'react';

function VerVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);

    // Simulación de la petición para obtener la información de los vehículos
    useEffect(() => {
        // Aquí reemplaza con tu API real
        const fetchVehiculos = async () => {
            const response = await fetch('http://localhost:5000/api/vehiculos');  // Ruta para obtener los vehículos
            const data = await response.json();
            if (data.status === 'success') {
                setVehiculos(data.vehiculos);  // Asume que data.vehiculos es un array con la info de los vehículos
            }
        };

        fetchVehiculos();
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Vehículos Detectados</h2>

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
                    {vehiculos.map((vehiculo) => (
                        <tr key={vehiculo.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 border-b border-gray-200">{vehiculo.id}</td>
                            <td className="px-6 py-3 border-b border-gray-200">{vehiculo.placa}</td>
                            <td className="px-6 py-3 border-b border-gray-200">{vehiculo.velocidad} km/h</td>
                            <td className="px-6 py-3 border-b border-gray-200">{vehiculo.fecha}</td>
                            <td className="px-6 py-3 border-b border-gray-200">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    onClick={() => alert(`Ver vehículo ID: ${vehiculo.id}`)}
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

export default VerVehiculos;
