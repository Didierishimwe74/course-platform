import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: { primary: { main: '#1F5F6B' }, secondary: { main: '#E08A00' }, background: { default: '#F5F7F6' } },
  shape: { borderRadius: 8 },
  typography: { fontFamily: '"Segoe UI", system-ui, sans-serif', h4: { fontWeight: 700 } },
});

createRoot(document.getElementById('root')).render(
  <StrictMode><ThemeProvider theme={theme}><CssBaseline />
    <BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>
  </ThemeProvider></StrictMode>
);
