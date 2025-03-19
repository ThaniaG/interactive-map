function toChartCoordenates(rawData) {
  const data = JSON.parse(rawData);
  const result = {};
  for (const key of Object.keys(data)) {
    result[key] = data[key];
  }
  return result;
}

function createChartBySex(feature) {
  const ctx = document.getElementById('chart-canvas').getContext('2d');
  const popMen = toChartCoordenates(feature.properties.mens) ?? {};
  const popWomen = toChartCoordenates(feature.properties.womens) ?? {};
  const years = Object.keys(popMen).sort();
  const menData = years.map(year => popMen[year]);
  const womenData = years.map(year => popWomen[year]);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Hombres',
          data: menData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Mujeres',
          data: womenData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Año'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Población'
          }
        }
      }
    }
  });
}

function createTotalChart(feature) {
  const ctx = document.getElementById('chart-canvas-total').getContext('2d');
  const popMen = toChartCoordenates(feature.properties.mens) ?? {};
  const popWomen = toChartCoordenates(feature.properties.womens) ?? {};
  const total = {};
  for (const year of Object.keys(popMen)) {
    total[year] = (total[year] ?? 0) + popMen[year];
  }
  for (const year of Object.keys(popWomen)) {
    total[year] = (total[year] ?? 0) + popWomen[year];
  }
  const years = Object.keys(total).sort();
  const data = years.map(year => total[year]);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Población total',
          data: data,
          borderColor: 'rgb(42,187,127)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.1
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Año'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Población'
          }
        }
      }
    }
  });
}

function loadInfoCardChart() {
  window.map.on('click', '2d-bars', function(e) {
    if (!e.features || e.features.length === 0) return;
    
    const feature = e.features[0];
    const infoCard = document.getElementById('info-card-2d');
    infoCard.style.display = 'inherit';
    
    const infoContent = document.getElementById('info-content-2d');
    const name = feature.properties.name || 'S/N';
    const height = feature.properties.height || 'N/D';
    infoContent.innerHTML = `
      <h3 class="text-center"><strong>${name}</strong></h3>
      <p>Hombres: ${feature.properties.men}</p>
      <p>Mujeres: ${feature.properties.women}</p>
      <p>Total: ${height}</p>
    `;
  
    if (window.chartBySex) {
      window.chartBySex.destroy();
    }

    if (window.chartTotal) {
      window.chartTotal.destroy();
    }
    
    window.chartBySex = createChartBySex(feature);
    window.chartTotal = createTotalChart(feature);
  });

  window.map.on('click', function(e) {
    const features = window.map.queryRenderedFeatures(e.point, { layers: ['2d-bars'] });
    if (!features || features.length === 0) {
      const infoCard = document.getElementById('info-card-2d');
      infoCard.style.display = 'none';
    }
  });
}

window.loadInfoCardChart = loadInfoCardChart;
