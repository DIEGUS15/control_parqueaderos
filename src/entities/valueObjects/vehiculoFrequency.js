export class VehiculoFrequency {
  constructor(placa, vecesRegistrado, parqueadero = null) {
    this.placa = placa;
    this.veces_registrado = vecesRegistrado;
    if (parqueadero) {
      this.parqueadero = parqueadero;
    }
  }

  static fromPlacasArray(placas) {
    const conteoPlacas = {};
    placas.forEach((placa) => {
      conteoPlacas[placa] = (conteoPlacas[placa] || 0) + 1;
    });

    return Object.entries(conteoPlacas)
      .map(
        ([placa, vecesRegistrado]) =>
          new VehiculoFrequency(placa, vecesRegistrado)
      )
      .sort((a, b) => b.veces_registrado - a.veces_registrado);
  }

  static getTop10(frequencies) {
    return frequencies.slice(0, 10);
  }
}
