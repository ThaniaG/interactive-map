class Town {
  constructor({code, name, dataUrl, coordinatesUrl, municipalities, coordinates}) {
    this.code = code;
    this.name = name;
    this.dataUrl = dataUrl;
    this.coordinatesUrl = coordinatesUrl;
    this.municipalities = municipalities;
    this.coordinates = coordinates;
  }
}

window.Town = Town;