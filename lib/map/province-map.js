function loadProvinceBorders() {
  window.map.addLayer({
    id: 'province-borders',
    type: 'line',
    source: 'provinces',
    layout: {},
    paint: {
      'line-color': '#DCDFE4', // Color del borde, por ejemplo blanco
      'line-width': 2,         // Grosor del borde (ajusta según necesidad)
      'line-opacity': 0.8,
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'highlight'], false],
        1, // visible si highlight es true
        0  // oculto si highlight es false
      ]
    }
  });
  window.map.setFilter('province-borders', ['==', ['get', 'code'], 'none']);
}

window.loadProvinceBorders = loadProvinceBorders;
