class Province {
  towns = [];
  
  constructor({code, name, towns}) {
    this.code = code;
    this.name = name;
    this.towns = towns;
  }
}

window.Province = Province;