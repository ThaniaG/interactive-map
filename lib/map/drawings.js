/**
 * Method to adjust the height of the bars according to the intervals in order to visualize them better
 * and differentiate them.
 * @param height - Height of the bar.
 * @returns - Adjusted height of the bar.
 */
function computeAdjustedHeight(height) {
  let adjustedHeight = 0;
  const intervals = window.intervals;

  for (let i = 0; i < intervals.length; i++) {
    const { lower, upper, factor } = intervals[i];
    if (height >= lower && height < upper) {
      adjustedHeight += (height - lower) * factor;
      return adjustedHeight;
    } else {
      adjustedHeight += (upper - lower) * factor;
    }
  }

  return adjustedHeight;
}

/**
 * Build the bars to display on the map according to the current data.
 * @returns - Array of polygons to display on the map.
 */
function buildBars() {
  const drawings = [];

  for (const province of window.provinces) {
    for (const town of province.towns) {
      for (const municipality of town.municipalities) {
        const is2d = window.options.currentView === '2d';
        let polygonData = town.coordinates[municipality.idMunicipio];
        let height = 0;

        if (!polygonData) {
          continue;
        }
        
        if ((window.options.isMenSelected && window.options.isWomenSelected) || is2d) {
          height = municipality.hombres[window.options.selectedYear] + municipality.mujeres[window.options.selectedYear];
        } else if (window.options.isMenSelected) {
          height = municipality.hombres[window.options.selectedYear];
        } else if (window.options.isWomenSelected) {
          height = municipality.mujeres[window.options.selectedYear];
        }

        const polygonGeometry = polygonData.features[0].geometry;
        const polygon = {
          id: municipality.idMunicipio,
          type: 'Feature',
          geometry: {
            type: polygonGeometry.type,
            coordinates: polygonGeometry.coordinates,
          },
          properties: {
            height: height,
            code: town.code,
            name: municipality.nombreMunicipio,
            year: window.options.selectedYear,
            isMenSelected: window.options.isMenSelected,
            isWomenSelected: window.options.isWomenSelected,
            men: municipality.hombres[window.options.selectedYear],
            women: municipality.mujeres[window.options.selectedYear],
            mens: municipality.hombres,
            womens: municipality.mujeres,
          }
        };
        drawings.push(polygon);
      }
    }
  }

  drawings.forEach(feature => {
    const height = feature.properties.height;
    feature.properties.adjustedHeight = computeAdjustedHeight(height);
  });
  
  return drawings;
}

/**
 * Build the provinces to display on the map. It only shows the borders.
 * @returns - Array of polygons to display on the map.
 */
function buildProvinces() {
  const drawings = [];

  for (const province of window.provinces) {
    for (const town of province.towns) {
      const polygonData = province.townsCoordinates[town.code];

      if (!polygonData) {
        continue;
      }

      const polygonGeometry = polygonData.features[0].geometry;

      const polygon = {
        id: province.code,
        type: 'Feature',
        geometry: {
          type: polygonGeometry.type,
          coordinates: polygonGeometry.coordinates,
        },
        properties: {
          code: town.code,
        }
      };
      drawings.push(polygon);
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
  window.geoProvinces.features = buildProvinces();
  window.map.getSource('provinces').setData(window.geoProvinces);
  window.map.getSource('bars').setData(window.geojsonData);
}

window.refreshMap = refreshMap;
window.buildBars = buildBars;
window.buildProvinces = buildProvinces;
