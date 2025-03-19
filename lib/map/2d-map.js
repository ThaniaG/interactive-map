let hoveredFeatureId = null;
let currentPopup2d = null;

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
        '#091E42', // color when it's hovered
        [
          'interpolate',
          ['linear'],
          ['to-number', ['get', 'height']],
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
        ]
      ],
      'fill-opacity': 0.5
    }
  });
}

/**
 * Hide the 2D map.
 */
function hide2DMap() {
  window.map.setLayoutProperty('2d-bars', 'visibility', 'none');
  const infoCard = document.getElementById('info-card-2d');
  infoCard.style.display = 'none';
}

/**
 * Show the 2D map.
 */
function show2DMap() {
  window.map.setLayoutProperty('2d-bars', 'visibility', 'visible');
  resetSexCheckboxes();
  window.options.currentView = '2d';
  window.refreshMap();
}

function resetSexCheckboxes() {
  const menCheckbox = document.getElementById('menCheckbox');
  const womenCheckbox = document.getElementById('womenCheckbox');
  menCheckbox.checked = true;
  womenCheckbox.checked = true;
  window.options.isMenSelected = true;
  window.options.isWomenSelected = true;
}

/**
 * Set the hover effect on the 2D map.
 */
function set2DHovered() {
  window.map.on('mousemove', function(e) {
    if (!window.map.getLayer('2d-bars')) return;
  
    const features = window.map.queryRenderedFeatures(e.point, { layers: ['2d-bars'] });
  
    if (features.length) {
      const feature = features[0];
  
      if (currentPopup2d) {
        currentPopup2d
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${feature.properties.name}</strong>`);
      } else {
        currentPopup2d = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        })
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${feature.properties.name}</strong>`)
        .addTo(window.map);
      }
    } else {
      if (currentPopup2d) {
        currentPopup2d.remove();
        currentPopup2d = null;
      }
    }
  });
}

window.load2DMap = load2DMap;
window.set2DHovered = set2DHovered;
