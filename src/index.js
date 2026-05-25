import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const basename = process.env.PUBLIC_URL || '/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);

reportWebVitals();
