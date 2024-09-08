import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';

const AppRoutes = ({ isLoggedIn }) => {
  return (
    <Router>
      <Routes>
        {/* Si el usuario no está logueado, redirige al login */}
        <Route path="/login" element={<Login />} />
        
        {/* Si está logueado, accede al Home */}
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        
        {/* Redirigir a login por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
