import React from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot en React 18
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container); // Crear un root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
