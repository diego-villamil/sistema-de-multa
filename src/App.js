import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Moderador from './components/Moderador';

const AppRoutes = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        
        <Route 
          path="/admin" 
          element={userRole === 'admin' ? <Admin /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/moderador" 
          element={userRole === 'moderador' ? <Moderador /> : <Navigate to="/login" />} 
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;