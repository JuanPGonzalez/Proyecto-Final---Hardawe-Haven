import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "root"),
            database=os.getenv("DB_NAME", "hardware_haven"),
            port=os.getenv("DB_PORT", "3306")
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

def get_available_components():
    connection = get_db_connection()
    if not connection:
        return "No se pudo conectar a la base de datos."

    try:
        cursor = connection.cursor(dictionary=True)
        # Query to get components. Adjust table/column names if necessary based on your schema.
        # Based on previous file exploration, table is 'componente' (or 'Componente' entity mapped to 'componente' table usually).
        # Columns seen in entity: name, description, imgURL.
        query = "SELECT name, description FROM componente LIMIT 20" 
        cursor.execute(query)
        result = cursor.fetchall()
        
        if not result:
            return "No hay componentes disponibles."
            
        components_text = ""
        for row in result:
            components_text += f"- {row['name']}: {row['description']}\n"
            
        return components_text

    except mysql.connector.Error as err:
        return f"Error al consultar componentes: {err}"
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    print(get_available_components())
