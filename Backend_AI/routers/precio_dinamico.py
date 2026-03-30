from fastapi import APIRouter
from pydantic import BaseModel
import random

import numpy as np
from sklearn.linear_model import LinearRegression

router = APIRouter()

class PrecioRequest(BaseModel):
    componente_id: str
    precio_base: float
    stock: int

class PrecioResponse(BaseModel):
    precio_actualizado: float
    motivo: str

# Modelo predictivo dummy (tendencia de demanda)
X_days = np.array([1, 2, 3, 4, 5]).reshape(-1, 1) # dias
y_demand = np.array([10, 12, 11, 15, 18]) # ventas por dia
trend_model = LinearRegression().fit(X_days, y_demand)

@router.post("/precio-dinamico", response_model=PrecioResponse, tags=["Precio Dinámico"])
def calcular_precio(req: PrecioRequest):
    # Prediccion de venta proximo dia
    predicted_demand = trend_model.predict([[6]])[0]

    multiplicador = 1.0
    motivo = "Precio base estándar"

    if req.stock < 10 and predicted_demand > 15:
        multiplicador = 1.20
        motivo = "Ajuste por alta demanda proyectada (ML) y bajo stock"
    elif req.stock > 100:
        multiplicador = 0.95
        motivo = "Descuento por exceso de inventario"

    fluctuacion = random.uniform(-0.02, 0.02)
    multiplicador += fluctuacion

    precio_final = round(req.precio_base * multiplicador, 2)

    return PrecioResponse(
        precio_actualizado=precio_final,
        motivo=motivo
    )
