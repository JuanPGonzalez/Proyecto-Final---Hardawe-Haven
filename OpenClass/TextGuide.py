import os

_guide_cache = None

def getGuide():
    global _guide_cache
    if _guide_cache is not None:
        return _guide_cache

    script_dir = os.path.dirname(os.path.abspath(__file__))
    txt_path = os.path.join(script_dir, "Guide.txt")
    
    try:
        with open(txt_path, "r", encoding="utf-8") as txt_file:
            text = txt_file.read()

        if text.strip():
            _guide_cache = text
        else:
            print("El archivo está vacío.")
            _guide_cache = ""
            
    except FileNotFoundError:
        print(f"Error: El archivo '{txt_path}' no se encontró.")
        _guide_cache = ""
    except Exception as e:
        print(f"Ocurrió un error al leer el archivo: {e}")
        _guide_cache = ""
        
    return _guide_cache





