import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Interfaz from './components/Interfaz';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const onLogin = (token, userId) => {
    // Establece el estado de autenticación cuando el usuario se loguea
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    // Elimina los datos de autenticación cuando el usuario cierra sesión
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Redirige al login si ya está autenticado */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/interfaz" /> : <Login onLogin={onLogin} />} 
        />
        {/* Protege la ruta para la interfaz */}
        <Route 
          path="/interfaz/*" 
          element={isAuthenticated ? <Interfaz onLogout={onLogout} /> : <Navigate to="/login" />} 
        />
        {/* Redirige automáticamente al login si no estás autenticado */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/interfaz" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
