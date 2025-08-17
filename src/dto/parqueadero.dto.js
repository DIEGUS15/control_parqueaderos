export class CreateParqueaderoDto {
  constructor({
    nombre,
    direccion,
    capacidad,
    costoPorHora,
    socioId,
    activo = true,
  }) {
    this.nombre = nombre;
    this.direccion = direccion;
    this.capacidad = capacidad;
    this.costoPorHora = costoPorHora;
    this.socioId = socioId;
    this.activo = activo;
  }
}

export class UpdateParqueaderoDto {
  constructor({ nombre, direccion, capacidad, costoPorHora, socioId, activo }) {
    if (nombre !== undefined) this.nombre = nombre;
    if (direccion !== undefined) this.direccion = direccion;
    if (capacidad !== undefined) this.capacidad = capacidad;
    if (costoPorHora !== undefined) this.costoPorHora = costoPorHora;
    if (socioId !== undefined) this.socioId = socioId;
    if (activo !== undefined) this.activo = activo;
  }
}

export class ParqueaderoFiltersDto {
  constructor({
    activo,
    socioId,
    page = 1,
    limit = 10,
    includeInactive = false,
  }) {
    this.where = {};

    if (!includeInactive) {
      if (activo !== undefined) {
        this.where.activo = activo === "true";
      } else {
        this.where.activo = true;
      }
    } else {
      if (activo !== undefined) {
        this.where.activo = activo === "true";
      }
    }

    if (socioId) {
      this.where.socioId = parseInt(socioId);
    }

    this.page = parseInt(page);
    this.limit = parseInt(limit);
    this.skip = (this.page - 1) * this.limit;
  }
}

export class ParqueaderoResponseDto {
  constructor(parqueadero, message) {
    this.id = parqueadero.id;
    this.nombre = parqueadero.nombre;
    this.direccion = parqueadero.direccion;
    this.capacidad = parqueadero.capacidad;
    this.costoPorHora = parqueadero.costoPorHora;
    this.activo = parqueadero.activo;
    this.socio = parqueadero.socio;
    this.createdAt = parqueadero.createdAt;
    this.updatedAt = parqueadero.updatedAt;

    if (message) {
      this.message = message;
    }
  }
}

export class ParqueaderosStatsDto {
  constructor({
    totalParqueaderos,
    parqueaderosActivos,
    parqueaderosInactivos,
    totalCapacidad,
    sociosConParqueaderos,
  }) {
    this.statistics = {
      total_parqueaderos: totalParqueaderos,
      parqueaderos_activos: parqueaderosActivos,
      parqueaderos_inactivos: parqueaderosInactivos,
      capacidad_total: totalCapacidad._sum.capacidad || 0,
      socios_con_parqueaderos: sociosConParqueaderos.length,
    };

    this.socios_distribution = sociosConParqueaderos.map((item) => ({
      socio_id: item.socioId,
      cantidad_parqueaderos: item._count._all,
    }));
  }
}
