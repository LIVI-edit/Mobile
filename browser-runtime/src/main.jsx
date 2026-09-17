import React from 'react';
import ReactDOM from 'react-dom/client';
import BrowserRuntimeApp from './BrowserRuntimeApp.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRuntimeApp />
  </React.StrictMode>
);
