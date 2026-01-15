from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
import re
import TextGuide as tg
import platform
import db_connection

# Limpiar consola al iniciar
def clear_console():
    if platform.system() == "Windows":
        os.system("cls")
    else:
        os.system("clear")



# Cargar variables de entorno
load_dotenv()

# Inicializar Flask
app = Flask(__name__)
CORS(app)
# Crear cliente OpenAI
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Ruta para interactuar con el bot
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message")

    if not user_input:
        return jsonify({"error": "No se envió ningún mensaje."}), 400

    guide_content = tg.getGuide()
    
    system_prompt = f"""Eres un asistente de soporte técnico para Hardware Haven.
    Tu OBJETIVO PRINCIPAL es responder consultas basándote EXCLUSIVAMENTE en la siguiente información:
    
    --- INFORMACIÓN DE SOPORTE ---
    {guide_content}
    --- INVENTARIO DISPONIBLE ---
    {db_connection.get_available_components()}
    --- FIN INFORMACIÓN ---
    
    Si la respuesta no se encuentra en la información proporcionada, di amablemente que no tienes esa información y sugiere contactar a un humano.
    Puedes usar la información del inventario para responder preguntas sobre qué componentes hay.
    Sé conciso, amable y profesional."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )

        content = response.choices[0].message.content if response.choices else ""
        cleaned_response = re.sub(r'[*#]+', '', content)
        return jsonify({"response": cleaned_response})

    except Exception as e:
        print(f"Error en el chatbot: {e}") # Log error to console
        return jsonify({"error": str(e)}), 500

clear_console()
print("OpenClass is running on port 5000 ...")
# Iniciar servidor
if __name__ == "__main__":
    app.run(debug=True, port=5000)
