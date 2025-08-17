export class HistorialVehiculo {
  constructor(data) {
    this.id = data.id;
    this.placa = data.placa;
    this.parqueaderoId = data.parqueaderoId;
    this.fechaIngreso = data.fechaIngreso;
    this.fechaSalida = data.fechaSalida;
    this.montoTotal = data.montoTotal;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  tiempoTotalEstacionado() {
    if (!this.fechaIngreso || !this.fechaSalida) return 0;
    return Math.floor(
      (new Date(this.fechaSalida) - new Date(this.fechaIngreso)) / (1000 * 60)
    ); // en minutos
  }

  tiempoTotalEstacionadoHoras() {
    return Math.floor(this.tiempoTotalEstacionado() / 60); // en horas
  }

  montoPorHora() {
    const horas = this.tiempoTotalEstacionadoHoras();
    return horas > 0 ? this.montoTotal / horas : 0;
  }

  toJSON() {
    return {
      id: this.id,
      placa: this.placa,
      parqueaderoId: this.parqueaderoId,
      fechaIngreso: this.fechaIngreso,
      fechaSalida: this.fechaSalida,
      montoTotal: this.montoTotal,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
