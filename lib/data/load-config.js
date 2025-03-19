const configUrl = 'https://thaniag.github.io/interactive-map/data/config.json';
window.provinces = [];

/**
 * Load the configuration data from the server.
 * When the configuration is loaded, it fetches the data for each town.
 * @returns - Array of provinces with their towns and municipalities.
 */
async function loadConfig() {
  const provinces = [];
  const response = await fetchData.loadJSON(configUrl);

  for (const province of response) {
    const townCoordinates = await fetchData.loadJSON(province.townsCoordinates);
    province.townsCoordinates = townCoordinates;
    const provinceData = new Province({
      ...province,
      towns: [],
    });

    for (const town of province.towns) {
      const townData = await fetchData.loadJSON(town.dataUrl);
      const townCoordinates = await fetchData.loadJSON(town.coordenatesUrl);
      const newTown = new Town({
        ...town,
        municipalities: townData,
        coordinates: townCoordinates
      });
      provinceData.towns.push(newTown);
    }

    provinces.push(provinceData);
  }

  return provinces;
}

window.loadConfig = loadConfig;