from fastapi import APIRouter
from pydantic import BaseModel

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

class RecomendacionRequest(BaseModel):
    usuario_id: str | None = None
    producto_actual_id: str | None = None

class RecomendacionResponse(BaseModel):
    recomendados_para_ti: list[str]
    tambien_compraron: list[str]

# Matriz de items dummy (Features)
item_ids = ["comp-101", "comp-102", "comp-105", "comp-203", "comp-204"]
item_features = np.array([
    [1, 0, 0], # comp-101
    [1, 1, 0], # comp-102
    [0, 1, 1], # comp-105
    [0, 0, 1], # comp-203
    [1, 0, 1], # comp-204
])
similarity_matrix = cosine_similarity(item_features)

@router.post("/recomendaciones", response_model=RecomendacionResponse, tags=["Recomendaciones"])
def obtener_recomendaciones(req: RecomendacionRequest):
    try:
        idx = item_ids.index(req.producto_actual_id)
        sim_scores = list(enumerate(similarity_matrix[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        recomendados = [item_ids[i[0]] for i in sim_scores[1:3]]
        tambien = [item_ids[i[0]] for i in sim_scores[3:5]]
    except Exception:
        recomendados = ["comp-101", "comp-102"]
        tambien = ["comp-203", "comp-204"]

    return RecomendacionResponse(
        recomendados_para_ti=recomendados,
        tambien_compraron=tambien
    )
