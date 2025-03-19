mapboxgl.accessToken = 'pk.eyJ1IjoicGFvbG9tb24yMyIsImEiOiJjbTdxMGRvdnEwdHcxMmtwc2oyMmEzazQ3In0.pW_d5cIrlVykzl5FUS540g';

function initMap() {
  window.loadLegendIntervals();
  window.geojsonData = {
    type: 'FeatureCollection',
    features: window.buildBars()
  };
  window.geoProvinces = {
    type: 'FeatureCollection',
    features: window.buildProvinces()
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
        -14.586628660444433,
        33.832673768124735
      ], // Southwest coordinates
      [
        3.2469842506808675,
        45.31668913957901
      ], // Northeast coordinates
    ]
  });

  // Load the map
  window.map.on('load', function () {
    window.map.addSource('bars', {
      type: 'geojson',
      data: window.geojsonData
    });
    window.map.addSource('provinces', {
      type: 'geojson',
      data: window.geoProvinces,
    });

    window.load3DMap();
    window.set3DHovered();
    window.load2DMap();
    window.set2DHovered();
    window.hide2DMap();
    window.loadProvinceBorders();

    window.loadInfoCard();
    window.loadInfoCardChart();
    window.generateLegendHTML();

    // load the controls
    window.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
    window.map.addControl(new RotateControl(), 'bottom-left');
    window.map.addControl(new TiltControl(), 'bottom-left');
    window.map.addControl(new UntiltControl(), 'bottom-left');
    map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }), 'bottom-left');
  });
}

window.initMap = initMap;
