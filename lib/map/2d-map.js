let hoveredFeatureId = null;

/**
 * Load the 2D map.
 */
function load2DMap() {
  window.map.addLayer({
    id: '2d-bars',
    type: 'fill',
    source: 'bars',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#FF0000', // color when it's hovered
        [
          'interpolate',
          ['linear'],
          ['to-number', ['get', 'height']],
          0, '#0be047',
          200, '#42d92d',
          400, '#5cd200',
          600, '#70ca00',
          800, '#80c200',
          1000, '#8eba00',
          1400, '#9bb100',
          1800, '#b09f00',
          2200, '#ba9500',
          2600, '#c28b00',
          3000, '#cb7f00',
          3400, '#da6500',
          3800, '#df5700',
          4200, '#e44600',
          4600, '#e83200',
          5000, '#ea1010',
        ]
      ],
      'fill-opacity': 0.7
    }
  });
}

/**
 * Hide the 2D map.
 */
function hide2DMap() {
  window.map.setLayoutProperty('2d-bars', 'visibility', 'none');
}

/**
 * Show the 2D map.
 */
function show2DMap() {
  window.map.setLayoutProperty('2d-bars', 'visibility', 'visible');
}

/**
 * Set the hover effect on the 2D map.
 */
function set2DHovered() {
  window.map.on('mousemove', '2d-bars', function(e) {
    window.map.getCanvas().style.cursor = 'pointer';
    
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];

      if (hoveredFeatureId !== null && hoveredFeatureId !== feature.id) {
        window.map.setFeatureState(
          { source: 'bars', id: hoveredFeatureId },
          { hover: false }
        );
      }
      
      hoveredFeatureId = feature.id;
      window.map.setFeatureState(
        { source: 'bars', id: feature.id },
        { hover: true }
      );
    } else {
      // if there are no features under the pointer, clean the hover state
      if (hoveredFeatureId !== null) {
        window.map.setFeatureState(
          { source: 'bars', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
      }
    }
  });

  // event when the mouse leaves the layer
  window.map.on('mouseleave', '2d-bars', function() {
    window.map.getCanvas().style.cursor = '';
    if (hoveredFeatureId !== null) {
      window.map.setFeatureState(
        { source: 'bars', id: hoveredFeatureId },
        { hover: false }
      );
      hoveredFeatureId = null;
    }
  });
}

window.load2DMap = load2DMap;
window.set2DHovered = set2DHovered;
