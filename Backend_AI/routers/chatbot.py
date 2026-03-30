from fastapi import APIRouter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

class ChatRequest(BaseModel):
    mensaje_usuario: str
    usuario_id: str | None = None

class ChatResponse(BaseModel):
    respuesta_bot: str
    intencion: str
    escalado: bool

# Entrenando modelo TF-IDF dummy
intent_corpus = [
    "quiero comprar una computadora pc",
    "cual es el precio costo valor",
    "tengo un problema error falla roto",
    "quiero reclamar devolver garantia",
    "hola buenos dias ayuda"
]
intent_labels = [
    "intencion_compra",
    "intencion_compra",
    "queja",
    "queja",
    "consulta_general"
]
intent_responses = {
    "intencion_compra": "¡Excelente! Te puedo ayudar a encontrar los mejores componentes para tu PC.",
    "queja": "Lamento los inconvenientes. Estoy transfiriendo tu caso a un agente humano en este momento.",
    "consulta_general": "Hola! Soy el asistente inteligente de Hardware Heaven. ¿En qué te puedo ayudar hoy?"
}

vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(intent_corpus)

@router.post("/chatbot", response_model=ChatResponse, tags=["Chatbot"])
def interactuar_chatbot(req: ChatRequest):
    X_test = vectorizer.transform([req.mensaje_usuario])
    similarities = cosine_similarity(X_test, X_train)[0]
    best_idx = similarities.argmax()
    
    if similarities[best_idx] < 0.2:
        intencion = "consulta_general"
    else:
        intencion = intent_labels[best_idx]

    escalado = (intencion == "queja")
    respuesta = intent_responses[intencion]

    return ChatResponse(
        respuesta_bot=respuesta,
        intencion=intencion,
        escalado=escalado
    )
