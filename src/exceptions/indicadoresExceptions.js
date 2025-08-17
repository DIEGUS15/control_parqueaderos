export class ParqueaderoNotFoundException extends Error {
  constructor(message = "Parqueadero not found") {
    super(message);
    this.name = "ParqueaderoNotFoundException";
    this.statusCode = 404;
  }
}

export class ParqueaderoPermissionDeniedException extends Error {
  constructor(
    message = "Parqueadero not found or you don't have permission to access it"
  ) {
    super(message);
    this.name = "ParqueaderoPermissionDeniedException";
    this.statusCode = 404;
  }
}

export class SearchParameterRequiredException extends Error {
  constructor(message = "El parámetro 'busqueda' es requerido") {
    super(message);
    this.name = "SearchParameterRequiredException";
    this.statusCode = 400;
  }
}
