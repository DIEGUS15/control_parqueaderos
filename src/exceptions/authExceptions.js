export class UserAlreadyExistsException extends Error {
  constructor(message = "El usuario ya existe") {
    super(message);
    this.name = "UserAlreadyExistsException";
    this.statusCode = 400;
  }
}

export class UserNotFoundException extends Error {
  constructor(message = "Usuario no encontrado") {
    super(message);
    this.name = "UserNotFoundException";
    this.statusCode = 400;
  }
}

export class InvalidCredentialsException extends Error {
  constructor(message = "Credenciales incorrectas") {
    super(message);
    this.name = "InvalidCredentialsException";
    this.statusCode = 400;
  }
}
