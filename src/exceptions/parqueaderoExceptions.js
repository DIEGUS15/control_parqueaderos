export class ParqueaderoNotFoundException extends Error {
  constructor(message = "Parqueadero not found") {
    super(message);
    this.name = "ParqueaderoNotFoundException";
    this.statusCode = 404;
  }
}

export class ParqueaderoAlreadyExistsException extends Error {
  constructor(message = "Ya existe un parqueadero con este nombre") {
    super(message);
    this.name = "ParqueaderoAlreadyExistsException";
    this.statusCode = 400;
  }
}

export class ParqueaderoHasActiveVehiclesException extends Error {
  constructor(
    message = "No se puede eliminar el parqueadero porque tiene vehículos activos"
  ) {
    super(message);
    this.name = "ParqueaderoHasActiveVehiclesException";
    this.statusCode = 400;
  }
}

export class SocioNotFoundException extends Error {
  constructor(message = "Socio not found") {
    super(message);
    this.name = "SocioNotFoundException";
    this.statusCode = 404;
  }
}

export class InvalidSocioRoleException extends Error {
  constructor(
    message = "El usuario debe tener el rol SOCIO para poder ser asignado a un parqueadero"
  ) {
    super(message);
    this.name = "InvalidSocioRoleException";
    this.statusCode = 400;
  }
}

export class SocioNotSocioRoleException extends Error {
  constructor(message = "User is not a SOCIO") {
    super(message);
    this.name = "SocioNotSocioRoleException";
    this.statusCode = 400;
  }
}
