import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';   // Importa el componente Admin
import Moderador from './components/Moderador';  // Importa el componente Moderador

const AppRoutes = () => {
  const userRole = localStorage.getItem('userRole');  // Obtener el rol del usuario desde localStorage

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Proteger las rutas basadas en el rol */}
        <Route path="/admin" element={userRole === 'admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/moderador" element={userRole === 'moderador' ? <Moderador /> : <Navigate to="/login" />} />
        
        {/* Redirigir a login por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
