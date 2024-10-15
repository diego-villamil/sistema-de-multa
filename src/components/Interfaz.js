import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BarraLateral from './BarraLateral';
import Admin from './Admin';
import Moderador from './Moderador';
import RegistrarCamaras from './RegistrarCamaras';
import VerCamaras from './VerCamaras';
import SubirVideo from './SubirVideo';
import VerInfracciones from './VerInfracciones';
import VerVehiculos from './VerVehiculos';
import AsignarCamaras from './AsignarCamaras';

function Interfaz({ onLogout }) {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(''); // Guarda la sección activa

    const fetchUserInfo = useCallback(async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            onLogout();
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.status === 'success') {
                setUserName(data.data.nombre);
                setUserEmail(data.data.email);
                setRole(data.data.rol || '');
                setLoading(false);
            } else {
                console.error('Error al obtener la información del usuario:', data.message);
                onLogout();
            }
        } catch (error) {
            console.error('Error al hacer la petición:', error);
            onLogout();
        }
    }, [onLogout]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const renderRoleComponent = useMemo(() => {
        if (loading) {
            return <div>Cargando...</div>;
        }

        const safeRole = role ? role.toLowerCase() : '';

        switch (currentSection) {
            case 'registrar':
                return safeRole === 'administrador' ? <RegistrarCamaras /> : null;
            case 'asignar':
                return safeRole === 'administrador' ? <AsignarCamaras /> : null;

            case 'ver':
                return <VerCamaras />;
            case 'video':
                return <SubirVideo />;
            case 'infracciones':
                return <VerInfracciones />;
            case 'vehiculos':
                return <VerVehiculos />;
            case '':
                return safeRole === 'administrador' ? <Admin /> : <Moderador />;
            default:
                return <div>Sección no encontrada</div>;
        }
    }, [loading, role, currentSection]);

    const handleSectionChange = (section) => {
        setCurrentSection(section);
    };

    const renderBarraLateral = () => {
        const normalizedRole = role.toLowerCase();
        if (normalizedRole === 'moderador' || normalizedRole === 'administrador') {
            return (
                <BarraLateral
                    userName={userName}
                    userEmail={userEmail}
                    role={role}
                    onLogout={onLogout}
                    onSectionChange={handleSectionChange}
                />
            );
        }
        return null;
    };

    return (
        <div className="flex min-h-screen">
            {renderBarraLateral()}
            <main className="flex-1">
                {renderRoleComponent}
            </main>
        </div>
    );
}

export default Interfaz;
