// lib/components/config-card.js

// Obtener elementos del card de configuración
const sexSelect = document.getElementById('sexSelect');
const yearSlider = document.getElementById('yearSlider');
const yearValue = document.getElementById('yearValue');
const viewModeRadios = document.getElementsByName('viewMode');

yearSlider.addEventListener('input', function(e) {
  const selectedYear = e.target.value;
  yearValue.textContent = selectedYear;
});

sexSelect.addEventListener('change', function(e) {
  const selectedSex = e.target.value;
  window.options.selectedSex = selectedSex;
  window.refreshMap();
});

viewModeRadios.forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.checked) {
      if (this.value === '3d') {
        window.hide2DMap();
        window.show3DMap();
      } else if (this.value === '2d') {
        window.hide3DMap();
        window.show2DMap();
      }
    }
  });
});
