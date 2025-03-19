class Province {
  towns = [];
  townsCoordinates = [];
  
  constructor({code, name, towns, townsCoordinates}) {
    this.code = code;
    this.name = name;
    this.towns = towns;
    this.townsCoordinates = townsCoordinates;
  }
}

window.Province = Province;
