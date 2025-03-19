const colors = [
  "#0be047", "#42d92d", "#5cd200", "#70ca00", "#80c200",
  "#8eba00", "#9bb100", "#b09f00", "#ba9500", "#c28b00",
  "#cb7f00", "#da6500", "#df5700", "#e44600", "#e83200", "#ea1010"
];

function generateLegendIntervals(municipalities, numIntervals = 16) {
  let maxVal = 0;
  const intervals = [];

  municipalities.forEach(municipality => {
    Object.keys(municipality.hombres).forEach(year => {
      const total = municipality.hombres[year] + municipality.mujeres[year];
      if (total > maxVal) maxVal = total;
    });
  });

  const threshold1 = 1000;   // Hasta 1.000: cientos
  const threshold2 = 100000; // De 1.000 a 100.000: miles

  // 40%-40%-20%
  const group1Count = maxVal > threshold1 ? Math.floor(numIntervals * 0.4) : numIntervals;
  const group2Count = maxVal > threshold1 && maxVal <= threshold2 ? numIntervals - group1Count : 
                      maxVal > threshold2 ? Math.floor(numIntervals * 0.4) : 0;
  const group3Count = maxVal > threshold2 ? numIntervals - group1Count - group2Count : 0;

  // Grupo 1: desde 0 hasta threshold1
  const group1Upper = Math.min(threshold1, maxVal);
  const group1IntervalSize = group1Count > 0 ? Math.ceil(group1Upper / group1Count / 10) * 10 : group1Upper;
  for (let i = 0; i < group1Count; i++) {
    const lower = i * group1IntervalSize;
    const upper = (i + 1) * group1IntervalSize;
    const label = i === group1Count - 1 && group2Count + group3Count > 0 
      ? `${lower} - ${upper}` 
      : `${lower} - ${upper}`;
    intervals.push({ range: label, lower, upper, factor: 1 });
  }

  // Grupo 2: desde threshold1 hasta threshold2 (o hasta maxVal si este es menor)
  if (group2Count > 0) {
    const group2Upper = Math.min(threshold2, maxVal);
    const group2Range = group2Upper - threshold1;
    const group2IntervalSize = group2Count > 0 ? Math.ceil(group2Range / group2Count / 100) * 100 : group2Range;
    for (let i = 0; i < group2Count; i++) {
      const lower = threshold1 + i * group2IntervalSize;
      const upper = threshold1 + (i + 1) * group2IntervalSize;
      const label = i === group2Count - 1 && group3Count > 0 
        ? `${(lower/1000).toFixed(0)}k - ${(upper/1000).toFixed(0)}k` 
        : `${(lower/1000).toFixed(0)}k - ${(upper/1000).toFixed(0)}k`;
      intervals.push({ range: label, lower, upper, factor: 1 });
    }
  }

  // Grupo 3: desde threshold2 hasta maxVal
  if (group3Count > 0) {
    const group3Range = maxVal - threshold2;
    const group3IntervalSize = group3Count > 0 ? Math.ceil(group3Range / group3Count / 1000) * 1000 : group3Range;
    for (let i = 0; i < group3Count; i++) {
      const lower = threshold2 + i * group3IntervalSize;
      const upper = threshold2 + (i + 1) * group3IntervalSize;
      const label = i === group3Count - 1 
        ? `${(lower/1000).toFixed(0)}k+` 
        : `${(lower/1000).toFixed(0)}k - ${(upper/1000).toFixed(0)}k`;
      intervals.push({ range: label, lower, upper, factor: 1 });
    }
  }
  
  // Por ahora, asignamos un factor a cada intervalo
  intervals.forEach((interval, index) => {
    let factor = 1;
    if (index === 0) factor = 12;
    if (index === 1) factor = 10;
    if (index === 2) factor = 8;
    if (index === 3) factor = 6;
    if (index === 4) factor = 4;
    if (index === 5) factor = 2;
    if (index === 6) factor = 1;
    if (index === 7) factor = 0.9;
    if (index === 8) factor = 0.8;
    if (index === 9) factor = 0.7;
    if (index === 10) factor = 0.6;
    if (index === 11) factor = 0.5;
    if (index === 12) factor = 0.4;
    if (index === 13) factor = 0.3;
    if (index === 14) factor = 0.2;
    if (index === 15) factor = 0.1;
    interval.factor = factor;
  });
  return intervals;
}

function loadLegendIntervals() {
  let intervals = [];

  for (const province of window.provinces) {
    for (const town of province.towns) {
      intervals = generateLegendIntervals(town.municipalities);
    }
  }
  window.intervals = intervals;
  return intervals;
}

function generateLegendHTML() {
  const intervals = window.intervals;
  let html = '';
  intervals.forEach((interval, index) => {
    html += `
      <div class="card-item">
        <div class="card-color" style="background-color: ${colors[index]};"></div>
        <div class="card-text">${interval.range}</div>
      </div>
    `;
  });
  
  document.getElementById("legend").innerHTML = html;
}

window.loadLegendIntervals = loadLegendIntervals;
window.generateLegendHTML = generateLegendHTML;