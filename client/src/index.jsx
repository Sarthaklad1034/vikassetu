import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@styles/tailwind.css';
import '@styles/custom.css';

// Initialize WebSocket connection for real-time updates
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onmessage = (event) => {
  // Handle real-time updates
  const data = JSON.parse(event.data);
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('wsUpdate', { detail: data }));
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);