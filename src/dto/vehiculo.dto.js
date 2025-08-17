export class RegistroIngresoDto {
  constructor({ placa, parqueaderoId }) {
    this.placa = placa;
    this.parqueaderoId = parqueaderoId;
  }
}

export class RegistroSalidaDto {
  constructor({ placa, parqueaderoId }) {
    this.placa = placa;
    this.parqueaderoId = parqueaderoId;
  }
}

export class EmailNotificationDto {
  constructor({ email, placa, mensaje, parqueaderoId }) {
    this.email = email;
    this.placa = placa;
    this.mensaje = mensaje;
    this.parqueaderoId = parqueaderoId;
  }
}

export class VehiculoResponseDto {
  constructor(vehiculo) {
    this.id = vehiculo.id;
    this.placa = vehiculo.placa;
    this.fechaIngreso = vehiculo.fechaIngreso;
    this.createdAt = vehiculo.createdAt;
    this.updatedAt = vehiculo.updatedAt;
  }
}
