export class RegisterDto {
  constructor({ fullname, email, password }) {
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.role = "SOCIO"; // Valor por defecto
  }
}

export class LoginDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

export class AuthResponseDto {
  constructor(user) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
