import React from 'react';
import { Container, Box, Typography, CssBaseline } from '@mui/material';
import CalculadoraFechas from './components/CalculadoraFechas';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sistema de Gestión de Permisos Ambientales
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Calculadora de fechas límite para planes de manejo de residuos
          </Typography>
          
          <CalculadoraFechas />
        </Box>
      </Container>
    </>
  );
}

export default App; 