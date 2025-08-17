export class RegistroVehiculo {
  constructor(data) {
    this.id = data.id;
    this.placa = data.placa;
    this.parqueaderoId = data.parqueaderoId;
    this.fechaIngreso = data.fechaIngreso;
    this.fechaSalida = data.fechaSalida || null;
    this.activo = data.activo !== undefined ? data.activo : true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.parqueadero = data.parqueadero;
  }

  // Métodos de negocio
  estaActivo() {
    return this.activo;
  }

  isActive() {
    return this.activo;
  }

  tiempoEstacionado() {
    if (!this.fechaIngreso) return 0;
    const ahora = this.fechaSalida || new Date();
    return Math.floor((ahora - new Date(this.fechaIngreso)) / (1000 * 60)); // en minutos
  }

  calculateStayTime(fechaSalida = new Date()) {
    if (!this.fechaIngreso) return 0;
    const tiempoEstanciaMs = fechaSalida - new Date(this.fechaIngreso);
    const tiempoEstanciaHoras = tiempoEstanciaMs / (1000 * 60 * 60);
    return Math.ceil(tiempoEstanciaHoras); // Redondear hacia arriba
  }

  calculateTotalAmount(costoPorHora, fechaSalida = new Date()) {
    const horasACobrar = this.calculateStayTime(fechaSalida);
    return horasACobrar * parseFloat(costoPorHora);
  }

  toPublic() {
    return {
      id: this.id,
      placa: this.placa,
      fechaIngreso: this.fechaIngreso,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toJSON() {
    return {
      id: this.id,
      placa: this.placa,
      parqueaderoId: this.parqueaderoId,
      fechaIngreso: this.fechaIngreso,
      fechaSalida: this.fechaSalida,
      activo: this.activo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
