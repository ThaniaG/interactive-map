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

      ],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.9
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
  window.map.setLayoutProperty('3d-bars', 'visibility', 'visible');
  window.map.setPitch(45);
  window.map.setBearing(-17.6);
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
