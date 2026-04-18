import { StrictMode } from 'react';
2import { createRoot } from 'react-dom/client';
3import App from './App.tsx';
4import './index.css';
5
6createRoot(document.getElementById('root')!).render(
7  <StrictMode>
8    <App />
9  </StrictMode>
10);