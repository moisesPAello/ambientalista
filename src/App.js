import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';

function App() {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [diasHabiles, setDiasHabiles] = useState(45);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const calcularFecha = async () => {
    try {
      if (!fechaInicio) {
        setError('Por favor, selecciona una fecha de inicio');
        return;
      }

      const response = await axios.post('http://localhost:8000/calcular-fecha-limite', {
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        dias_habiles: diasHabiles
      });

      setResultado(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al calcular la fecha');
      setResultado(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Calculadora de Fechas Límite
          </Typography>
          
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="Fecha de recepción del permiso"
                value={fechaInicio}
                onChange={(newValue) => setFechaInicio(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Días hábiles para entrega"
                type="number"
                value={diasHabiles}
                onChange={(e) => setDiasHabiles(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={calcularFecha}
              disabled={!fechaInicio}
            >
              Calcular Fecha Límite
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {resultado && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  <Typography variant="body1">
                    Fecha de inicio: {resultado.fecha_inicio}
                  </Typography>
                  <Typography variant="body1">
                    Días hábiles: {resultado.dias_habiles}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Fecha límite: {resultado.fecha_limite}
                  </Typography>
                </Alert>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default App; 