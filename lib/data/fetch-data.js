const fetchData = {
  /**
   * Load a JSON file from a given URL.
   * @param url - URL del archivo JSON.
   * @returns - JSON data from the URL.
   */
  loadJSON: async function(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to load JSON:", error);
      throw error;
    }
  },

  /**
   * Load multiple JSON files from an array of URLs.
   * @param urls - Array de URLs de archivos JSON.
   * @returns - JSON data from all URLs.
   */
  loadMultiple: async function(urls) {
    try {
      const promises = urls.map(url => this.loadJSON(url));
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error al cargar múltiples JSON:", error);
      throw error;
    }
  }
};

window.fetchData = fetchData;
