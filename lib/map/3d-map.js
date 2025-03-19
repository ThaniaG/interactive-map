let currentPopup = null;

/**
 * Load the 3D map.
 */
function load3DMap() {
  window.map.addLayer({
    id: '3d-bars',
    type: 'fill-extrusion',
    source: 'bars',
    paint: {
      'fill-extrusion-vertical-gradient': false,
      'fill-extrusion-color': [
        'interpolate',
        ['linear'],
        ['get', 'height'],
        window.intervals[0].lower, '#0be047',
        window.intervals[1].lower, '#42d92d',
        window.intervals[2].lower, '#5cd200',
        window.intervals[3].lower, '#70ca00',
        window.intervals[4].lower, '#80c200',
        window.intervals[5].lower, '#8eba00',
        window.intervals[6].lower, '#9bb100',
        window.intervals[7].lower, '#b09f00',
        window.intervals[8].lower, '#ba9500',
        window.intervals[9].lower, '#c28b00',
        window.intervals[10].lower, '#cb7f00',
        window.intervals[11].lower, '#da6500',
        window.intervals[12].lower, '#df5700',
        window.intervals[13].lower, '#e44600',
        window.intervals[14].lower, '#e83200',
        window.intervals[15].lower, '#ea1010',
      ],
      'fill-extrusion-height': ['get', 'adjustedHeight'],
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.9,
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'highlight'], false],
        1, // visible si highlight es true
        0  // oculto si highlight es false
      ]
    }
  });
}

/**
 * Hide the 3D map.
 */
function hide3DMap() {
  window.map.setLayoutProperty('3d-bars', 'visibility', 'none');
  window.map.setPitch(0);
  window.map.setBearing(0);
}

/**
 * Show the 3D map.
 */
function show3DMap() {
  window.options.currentView = '3d';
  window.map.setLayoutProperty('3d-bars', 'visibility', 'visible');
  window.map.setPitch(45);
  window.map.setBearing(-17.6);
  window.refreshMap();
}

/**
 * Set the hover effect on the 3D map.
 * @returns void
 */
function set3DHovered() {
  window.map.on('mousemove', function(e) {
    if (!window.map.getLayer('3d-bars')) return;
  
    const features = window.map.queryRenderedFeatures(e.point, { layers: ['3d-bars'] });
  
    if (features.length) {
      const feature = features[0];
  
      if (currentPopup) {
        currentPopup
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${feature.properties.name}</strong>`);
      } else {
        currentPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        })
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${feature.properties.name}</strong>`)
        .addTo(window.map);
      }
    } else {
      if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
      }
    }
  });
}

window.load3DMap = load3DMap;
window.set3DHovered = set3DHovered;
