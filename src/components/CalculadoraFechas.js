import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper,
  Alert,
  Typography,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import { format } from 'date-fns';

const CalculadoraFechas = () => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [diasHabiles, setDiasHabiles] = useState(45);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const calcularFecha = async () => {
    try {
      if (!fechaInicio) {
        setError('Por favor, selecciona una fecha de inicio');
        return;
      }

      setLoading(true);
      setError(null);

      // Formatear la fecha en formato YYYY-MM-DD
      const fechaFormateada = format(fechaInicio, 'yyyy-MM-dd');

      const response = await axios.post('http://localhost:8000/calcular-fecha-limite', {
        fecha_inicio: fechaFormateada,
        dias_habiles: diasHabiles
      });

      setResultado(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al calcular la fecha');
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Calculadora de Fechas Límite
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Fecha de recepción del permiso"
              value={fechaInicio}
              onChange={(newValue) => setFechaInicio(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format="dd/MM/yyyy"
              disableFuture={false}
              disablePast={false}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Días hábiles para entrega"
              type="number"
              value={diasHabiles}
              onChange={(e) => setDiasHabiles(parseInt(e.target.value) || 0)}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={calcularFecha}
              disabled={!fechaInicio || loading || diasHabiles < 1}
            >
              {loading ? 'Calculando...' : 'Calcular Fecha Límite'}
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">
                {error}
              </Alert>
            </Grid>
          )}

          {resultado && (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body1">
                  Fecha de inicio: {resultado.fecha_inicio}
                </Typography>
                <Typography variant="body1">
                  Días hábiles: {resultado.dias_habiles}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                  Fecha límite: {resultado.fecha_limite}
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default CalculadoraFechas; 