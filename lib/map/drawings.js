/**
 * Build the bars to display on the map according to the current data.
 * @returns - Array of polygons to display on the map.
 */
function buildBars() {
  const drawings = [];

  for (const province of window.provinces) {
    for (const town of province.towns) {
      for (const municipality of town.municipalities) {
        let coordinates = town.coordinates[municipality.idMunicipio] ?? [];

        if (coordinates.length !== 0) {
          coordinates = coordinates.features[0].geometry.coordinates[0]
        } else {
          // check the coordinates and data
          continue;
        }

        const sexKey = window.options.selectedSex === 'men' ? 'hombres' : 'mujeres';
        let height = municipality[sexKey][window.options.selectedYear];
        
        if (window.options.selectedSex === 'both') {
          height = municipality.hombres[window.options.selectedYear] + municipality.mujeres[window.options.selectedYear];
        }

        const polygon = {
          id: municipality.idMunicipio,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          },
          properties: {
            height: height,
            name: municipality.nombreMunicipio,
            year: window.options.selectedYear,
            sex: window.options.selectedSex,
          }
        };
        drawings.push(polygon);
      }
    }
  }
  return drawings;
}

/**
 * Refresh the map with the new data.
 * @returns void
 */
function refreshMap() {
  window.geojsonData.features = buildBars();
  window.map.getSource('bars').setData(window.geojsonData);
}

window.refreshMap = refreshMap;
window.buildBars = buildBars;