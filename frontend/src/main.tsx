import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Connect } from '@stacks/connect-react';
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App';
import './index.css';

// Configure Connect for Stacks authentication
const appConfig = {
  name: 'sBTC Yield Nexus',
  icon: window.location.origin + '/yield-nexus-logo.png',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Connect authOptions={{ appDetails: appConfig }}>
        <App />
        <Toaster />

      </Connect>
    </BrowserRouter>
  </StrictMode>
);
