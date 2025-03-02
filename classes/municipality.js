class Municipality {
  constructor({
    idMunicipio,
    nombreMunicipio,
    hombres,
    mujeres,
  }) {
    this.id = idMunicipio;
    this.nombre = nombreMunicipio;
    this.hombres = hombres;
    this.mujeres = mujeres;
  }
}

window.Municipality = Municipality;