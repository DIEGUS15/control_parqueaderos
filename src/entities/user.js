export class User {
  constructor({
    id,
    fullname,
    email,
    password,
    role,
    activo,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.role = role;
    this.activo = activo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Método para obtener datos públicos (sin password)
  toPublic() {
    const { password, ...publicData } = this;
    return publicData;
  }

  // Método para validar si el usuario está activo
  isActive() {
    return this.activo;
  }
}
