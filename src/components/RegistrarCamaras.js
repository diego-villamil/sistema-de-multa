import React, { useState } from 'react';

function RegistrarCamara() {
    const [nombre, setNombre] = useState('');

    const handleRegistrarCamara = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/registrar_camara', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert(data.message);
            setNombre(''); // Reset input field
        } else {
            alert(`Error: ${data.message}`);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Registrar Cámara</h2>
            <form onSubmit={handleRegistrarCamara} className="space-y-4">
                {/* Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Nombre de la cámara"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                        Registrar Cámara
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegistrarCamara;
