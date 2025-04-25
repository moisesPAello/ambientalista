from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from dateutil import rrule
import requests
from typing import List
import pytz
from dateutil import parser
from pydantic import BaseModel

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para la petición
class FechaRequest(BaseModel):
    fecha_inicio: str
    dias_habiles: int = 45

# Zona horaria de México
MEXICO_TZ = pytz.timezone('America/Mexico_City')

class FechaCalculadora:
    def __init__(self):
        self.dias_inhabiles = set()  # Se actualizará con los días inhábiles del calendario oficial

    async def obtener_dias_inhabiles(self):
        # TODO: Implementar la obtención de días inhábiles del calendario oficial
        # Por ahora usaremos una lista estática de ejemplo
        return {
            datetime(2024, 1, 1),  # Año Nuevo
            datetime(2024, 2, 5),  # Día de la Constitución
            datetime(2024, 3, 21),  # Natalicio de Benito Juárez
            # Agregar más días inhábiles según el calendario oficial
        }

    def es_dia_habil(self, fecha: datetime) -> bool:
        # Verifica si es fin de semana
        if fecha.weekday() >= 5:  # 5 es sábado, 6 es domingo
            return False
        
        # Verifica si es día inhábil
        fecha_sin_hora = fecha.replace(hour=0, minute=0, second=0, microsecond=0)
        return fecha_sin_hora not in self.dias_inhabiles

    def calcular_fecha_limite(self, fecha_inicio: datetime, dias_habiles: int) -> datetime:
        fecha_actual = fecha_inicio
        dias_contados = 0

        while dias_contados < dias_habiles:
            fecha_actual += timedelta(days=1)
            if self.es_dia_habil(fecha_actual):
                dias_contados += 1

        return fecha_actual

@app.post("/calcular-fecha-limite")
async def calcular_fecha_limite(request: FechaRequest):
    try:
        # Intentar parsear la fecha en diferentes formatos
        try:
            fecha_inicio_dt = parser.parse(request.fecha_inicio, dayfirst=True)
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inválido. Use DD/MM/YYYY o YYYY-MM-DD")

        # Asegurarse de que la fecha esté en la zona horaria correcta
        if fecha_inicio_dt.tzinfo is None:
            fecha_inicio_dt = MEXICO_TZ.localize(fecha_inicio_dt)

        # Crear instancia de la calculadora
        calculadora = FechaCalculadora()
        
        # Obtener días inhábiles
        calculadora.dias_inhabiles = await calculadora.obtener_dias_inhabiles()
        
        # Calcular fecha límite
        fecha_limite = calculadora.calcular_fecha_limite(fecha_inicio_dt, request.dias_habiles)
        
        return {
            "fecha_inicio": fecha_inicio_dt.strftime("%d/%m/%Y"),
            "dias_habiles": request.dias_habiles,
            "fecha_limite": fecha_limite.strftime("%d/%m/%Y")
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 