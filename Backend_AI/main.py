from fastapi import FastAPI
from routers import chatbot, recomendaciones, precio_dinamico

app = FastAPI(
    title="Hardware Heaven AI Engine",
    description="Microservicio de IA para el e-commerce Hardware Heaven",
    version="1.0.0"
)

app.include_router(chatbot.router, prefix="/api/v1")
app.include_router(recomendaciones.router, prefix="/api/v1")
app.include_router(precio_dinamico.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "AI Engine is running"}
