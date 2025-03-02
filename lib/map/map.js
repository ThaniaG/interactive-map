mapboxgl.accessToken = 'pk.eyJ1IjoicGFvbG9tb24yMyIsImEiOiJjbTdxMGRvdnEwdHcxMmtwc2oyMmEzazQ3In0.pW_d5cIrlVykzl5FUS540g';

function initMap() {
  window.geojsonData = {
    type: 'FeatureCollection',
    features: window.buildBars()
  };

  // start the map
  window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-5.5672632415771375, 42.59930574650096],
    zoom: 6,
    pitch: 45,
    bearing: -17.6,
    antialias: true,
    maxBounds: [
      [
        -10.374952829148697,
        36.71308103642173
      ], // Southwest coordinates
      [
        1.3679917440043994,
        43.45966347225905
      ], // Northeast coordinates
    ]
  });

  // Load the map
  window.map.on('load', function () {
    window.map.addSource('bars', {
      type: 'geojson',
      data: window.geojsonData
    });

    window.load3DMap();
    window.set3DHovered();
    window.load2DMap();
    window.set2DHovered();
    window.hide2DMap();
  });
}

window.initMap = initMap;
