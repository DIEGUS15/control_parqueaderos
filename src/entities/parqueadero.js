export class Parqueadero {
  constructor({
    id,
    nombre,
    direccion,
    capacidad,
    costoPorHora,
    activo,
    socioId,
    createdAt,
    updatedAt,
    socio,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.direccion = direccion;
    this.capacidad = capacidad;
    this.costoPorHora = costoPorHora;
    this.activo = activo;
    this.socioId = socioId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.socio = socio;
  }

  // Métodos de negocio
  isActive() {
    return this.activo;
  }

  toggleStatus() {
    this.activo = !this.activo;
  }

  canBeAssignedToSocio(socio) {
    return socio && socio.role === "SOCIO" && socio.activo;
  }

  // Método para obtener datos de respuesta
  toResponse() {
    return {
      id: this.id,
      nombre: this.nombre,
      direccion: this.direccion,
      capacidad: this.capacidad,
      costoPorHora: this.costoPorHora,
      activo: this.activo,
      socio: this.socio,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
