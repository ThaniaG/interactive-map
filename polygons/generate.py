import requests
from bs4 import BeautifulSoup
import json
import re
import os
import zipfile
import shutil
import tempfile
import geopandas as gpd
from urllib.parse import urljoin

def get_zip_links(url):
    response = requests.get(url)
    response.encoding = 'utf-8'
    zip_links = []
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for a in soup.find_all('a'):
            href = a.get('href')
            if href and href.lower().endswith('.zip'):
                full_link = urljoin(url, href)
                # Buscar cualquier secuencia de dígitos en el nombre
                match = re.search(r'(\d+)', href)
                if match:
                    id_val = str(int(match.group(1)))
                else:
                    id_val = None
                zip_links.append({"id": id_val, "downloadLink": full_link})
    else:
        print(f"Error al acceder a la página {url}: {response.status_code}")
    
    return zip_links


def download_file(url, output_path):
    """
    Descarga el archivo de la URL y lo guarda en output_path.
    """
    print(f"Descargando: {url}")
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    print(f"Descargado a: {output_path}")

def extract_zip(zip_path, extract_to):
    """
    Descomprime el archivo zip en el directorio indicado.
    """
    print(f"Extrayendo {zip_path} en {extract_to}")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print("Extracción completada.")

def find_shapefile(directory, municipality_id):
    """
    Busca en el directorio un archivo .shp que comience con el ID y que contenga '_POLFE'.
    Si no se encuentra, devuelve el primer .shp que encuentre.
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.shp'):
                if file.startswith(municipality_id) and "_POLFE" in file:
                    return os.path.join(root, file)
    # Si no se encontró uno que cumpla el patrón, se retorna el primer .shp encontrado
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.shp'):
                return os.path.join(root, file)
    return None

def process_zip(zip_info, tmp_dir, source_match, destination_path):
    """
    Para cada archivo ZIP:
      - Descarga el zip.
      - Lo extrae.
      - Busca el shapefile y lo procesa (lectura y dissolve con geopandas).
      - Busca en source_match el entry correspondiente según el ID.
      - Guarda el GeoDataFrame disuelto en un JSON con nombre <sourceId>.json.
      - Elimina los archivos temporales.
    """
    municipality_id = zip_info["id"]
    download_link = zip_info["downloadLink"]
    print(f"\nProcesando archivo ZIP para municipio {municipality_id}")
    # Definir ruta temporal para el ZIP
    zip_filename = os.path.basename(download_link)
    zip_path = os.path.join(tmp_dir, zip_filename)

    # Descargar el archivo ZIP
    download_file(download_link, zip_path)

    # Crear carpeta de extracción para este ZIP
    extract_folder = os.path.join(tmp_dir, os.path.splitext(zip_filename)[0])
    os.makedirs(extract_folder, exist_ok=True)

    # Extraer el ZIP
    extract_zip(zip_path, extract_folder)

    # Buscar el shapefile extraído
    shapefile_path = find_shapefile(extract_folder, municipality_id)
    if not shapefile_path:
        print(f"No se encontró shapefile para el municipio {municipality_id} en {extract_folder}")
        return None

    # Leer el shapefile y realizar dissolve
    print(f"Procesando shapefile: {shapefile_path}")
    try:
        gdf = gpd.read_file(shapefile_path)
    except Exception as e:
        print(f"Error al leer el shapefile {shapefile_path}: {e}")
        return None

    # Simplificar las geometrias para reducir el tamaño del JSON
    tolerance = 0.00001  # Ajusta este valor segun la densidad y precision que necesites
    try:
        gdf['geometry'] = gdf['geometry'].simplify(tolerance=tolerance, preserve_topology=True)
    except Exception as e:
        print(f"Error al simplificar las geometrías: {e}")
        return None
    
    # Limpiar las geometrías para corregir problemas topológicos
    try:
        gdf['geometry'] = gdf['geometry'].buffer(0)
    except Exception as e:
        print(f"Error al limpiar las geometrías con buffer(0): {e}")
        return None

    # Realizar dissolve para unir las geometrías si es necesario
    try:
        gdf_dissolved = gdf.dissolve()
    except Exception as e:
        print(f"Error al hacer dissolve del GeoDataFrame: {e}")
        return None

    # Buscar en source_match el entry correspondiente a este ID
    match_entry = next((item for item in source_match if str(item.get("id")) == municipality_id), None)
    if not match_entry:
        print(f"No se encontró entrada en source_match para el id {municipality_id}")
        return None

    source_id = match_entry.get("sourceId")
    output_filename = f"{destination_path}/{source_id}.json"
    output_json = gdf_dissolved.to_json()

    # Guardar el resultado en el archivo JSON
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(output_json)
    print(f"Guardado resultado en {output_filename}")

    # Eliminar archivos temporales: ZIP y carpeta extraída
    try:
        os.remove(zip_path)
        shutil.rmtree(extract_folder)
        print(f"Eliminados archivos temporales para {municipality_id}")
    except Exception as e:
        print(f"Error al eliminar archivos temporales: {e}")

    return output_filename

def combine_json_files(directory, output_filename):
    """
    Recorre todos los archivos JSON en 'directory' y combina su contenido en un solo objeto.
    Cada clave será el nombre del archivo sin extensión y el valor, el contenido JSON del archivo.
    Se guarda el resultado en 'output_filename' en formato minificado para reducir el tamaño.
    """
    combined = {}
    # Recorremos todos los archivos en el directorio indicado
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                try:
                    content = json.load(f)
                    # Usamos el nombre del archivo sin la extensión como key
                    key = os.path.splitext(filename)[0]
                    combined[key] = content
                except Exception as e:
                    print(f"Error al procesar {filename}: {e}")
    
    # Guardar el JSON combinado en el archivo de salida en formato minificado
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=None, separators=(',', ':'))
    print(f"Archivo JSON combinado generado: {output_filename}")


def main():
    base_path = os.path.dirname(os.path.abspath(__file__))
    # Lista de provincias (carpetas) a procesar
    provinces = [
        "leon",
    ]
    print("Directorio de trabajo actual:", os.getcwd())
    
    for province in provinces:
        # Cargar el archivo source_list.json para la provincia
        source_list_path = os.path.join(base_path, province, "source_list.json")
        with open(source_list_path, "r", encoding="utf-8") as f:
            source_list = json.load(f)

        # source_list se espera que sea una lista de objetos; iteramos sobre cada elemento
        for source_obj in source_list:
            # Cada objeto debería tener un par clave-valor: key = nombre del municipio (town) y value = URL
            for town, url in source_obj.items():
                # Cargar el archivo source_match.json para este municipio
                source_match_path = os.path.join(base_path, province, f"{town}_source_match.json")
                with open(source_match_path, "r", encoding="utf-8") as f:
                    source_match = json.load(f)
                
                print(f"\nProcesando fuente '{town}': {url}")
                zip_links = get_zip_links(url)
                print(f"Encontrados {len(zip_links)} archivos ZIP en la página.")
                destination_path = os.path.join(base_path, province, town)
                
                # Crear un directorio temporal para descargas y extracción
                with tempfile.TemporaryDirectory() as tmp_dir:
                    for zip_info in zip_links:
                        process_zip(zip_info, tmp_dir, source_match, destination_path)

                # combinar los archivos JSON generados en un solo archivo
                exported_json_directory = os.path.join(base_path, province, town)
                combined_json_path = os.path.join(base_path, "../data", province, f"{town}-coordinates.json")
                combine_json_files(exported_json_directory, combined_json_path)

if __name__ == "__main__":
    main()
