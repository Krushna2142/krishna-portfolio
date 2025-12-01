import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { initAxiosFromLocalStorage } from './setupAxios';

// Ensure axios has the Authorization header (if a token exists) BEFORE the app renders
// so protected routes and initial API calls include the token.
initAxiosFromLocalStorage();

// Initialize AOS (animations) before rendering
AOS.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);