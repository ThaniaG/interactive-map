let infoCard = document.getElementById('info-card');
let infoContent = document.getElementById('info-content');

function loadInfoCard() {
  window.map.on('mousemove', function(e) {
    if (!window.map.getLayer('3d-bars')) return;
    
    const features = window.map.queryRenderedFeatures(e.point, { layers: ['3d-bars'] });
    
    if (features.length) {
      infoCard.style.display = 'block';
      const feature = features[0];
      // informacion a mostrar
      let name = feature.properties.name || 'Sin nombre';
      let height = feature.properties.height || 'N/A';
      let otherInfo = '';
      let year = feature.properties.year || 'N/A';
      let sex = 'Hombres y mujeres';
      if (feature.properties.isMenSelected && !feature.properties.isWomenSelected) {
        sex = 'Hombres';
      } else if (!feature.properties.isMenSelected && feature.properties.isWomenSelected) {
        sex = 'Mujeres';
      }
      
      infoContent.innerHTML = `
        <h3 class="text-center"><strong>${name}</strong></h3>
        <p><strong>Año:</strong> ${year}</p>
        <p><strong>${sex}:</strong> ${height}</p>
        ${otherInfo}
      `;
    } else {
      infoCard.style.display = 'none';
    }
  });
}

window.loadInfoCard = loadInfoCard;
