export class ParqueaderoNotFoundOrNoPermissionException extends Error {
  constructor(
    message = "No se ha encontrado el parqueadero o no tiene permiso para acceder a él"
  ) {
    super(message);
    this.name = "ParqueaderoNotFoundOrNoPermissionException";
    this.statusCode = 404;
  }
}

export class VehiculoAlreadyInParqueaderoException extends Error {
  constructor(
    message = "No se puede Registrar Ingreso, ya existe la placa en este u otro parqueadero"
  ) {
    super(message);
    this.name = "VehiculoAlreadyInParqueaderoException";
    this.statusCode = 400;
  }
}

export class ParqueaderoCapacityFullException extends Error {
  constructor(message = "El parqueadero ha alcanzado su capacidad máxima") {
    super(message);
    this.name = "ParqueaderoCapacityFullException";
    this.statusCode = 400;
  }
}

export class VehiculoNotInParqueaderoException extends Error {
  constructor(
    message = "No se puede Registrar Salida, no existe la placa en el parqueadero"
  ) {
    super(message);
    this.name = "VehiculoNotInParqueaderoException";
    this.statusCode = 400;
  }
}

export class EmailServiceException extends Error {
  constructor(message = "Error al enviar notificación por email") {
    super(message);
    this.name = "EmailServiceException";
    this.statusCode = 500;
  }
}
