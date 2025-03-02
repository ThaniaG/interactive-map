async function initApp() {
  window.provinces = await window.loadConfig();
  window.initMap();
}

initApp();