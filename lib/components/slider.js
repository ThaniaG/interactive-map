const slider = document.getElementById('yearSlider');
const yearLabel = document.getElementById('yearValue');

slider.addEventListener('input', function(e) {
  const selectedYear = parseInt(e.target.value, 10);
  yearLabel.textContent = selectedYear;

  window.geojsonData.features[0].properties.year = selectedYear;
  window.options.selectedYear = selectedYear;

  window.refreshMap();
});
