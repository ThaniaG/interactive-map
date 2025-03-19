import json
import geopandas as gpd

name = 'leon'
with open(f'./data/leon/{name}-coordinates.json', 'r', encoding='utf-8') as f:
    municipios_data = json.load(f)

# Extraer todas las features de todos los municipios en una lista
features_list = []
for muni_id, fc in municipios_data.items():
    features = fc.get('features', [])
    for feature in features:
        features_list.append(feature)

# Crear un GeoDataFrame a partir de la lista de features
gdf = gpd.GeoDataFrame.from_features(features_list)

# Asegurarse de que el CRS esté definido, por ejemplo EPSG:4258
if gdf.crs is None:
    gdf.set_crs(epsg=4258, inplace=True)

# Agrupar los municipios por provincia usando la propiedad 'PROVINCIA'
# Esto realizará un dissolve de las geometrías de los municipios de cada provincia
provinces_gdf = gdf.dissolve(by='PROVINCIA')

# Opcional: Limpiar geometrías con buffer(0) para corregir errores topológicos
provinces_gdf['geometry'] = provinces_gdf['geometry'].buffer(0)

# Exportar el GeoDataFrame de provincias a un archivo GeoJSON
output_file = f'{name}.geojson'
provinces_gdf.to_file(output_file, driver='GeoJSON')

print(f"Archivo GeoJSON de provincias generado: {output_file}")
