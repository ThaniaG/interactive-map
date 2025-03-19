async function initApp() {
  window.provinces = await window.loadConfig();
  window.buildCheckboxList();
  window.initMap();
}

initApp();