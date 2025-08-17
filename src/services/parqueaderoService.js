import { ParqueaderoRepository } from "../repositories/parqueaderoRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import {
  CreateParqueaderoDto,
  UpdateParqueaderoDto,
  ParqueaderoFiltersDto,
  ParqueaderoResponseDto,
  ParqueaderosStatsDto,
} from "../dto/parqueadero.dto.js";
import {
  ParqueaderoNotFoundException,
  ParqueaderoAlreadyExistsException,
  SocioNotFoundException,
  InvalidSocioRoleException,
  SocioNotSocioRoleException,
  ParqueaderoHasActiveVehiclesException,
} from "../exceptions/parqueaderoExceptions.js";

export class ParqueaderoService {
  constructor() {
    this.parqueaderoRepository = new ParqueaderoRepository();
    this.userRepository = new UserRepository();
  }

  async getAllParqueaderos(queryParams) {
    const filters = new ParqueaderoFiltersDto(queryParams);

    const includeInactive = queryParams.includeInactive === "true";

    let parqueaderos, total;

    if (includeInactive) {
      parqueaderos = await this.parqueaderoRepository.findAllIncludingInactive(
        filters
      );
      total = await this.parqueaderoRepository.countIncludingInactive(
        filters.where
      );
    } else {
      parqueaderos = await this.parqueaderoRepository.findAll(filters);
      total = await this.parqueaderoRepository.count(filters.where);
    }

    return {
      parqueaderos: parqueaderos.map((p) => p.toResponse()),
      pagination: {
        current_page: filters.page,
        per_page: filters.limit,
        total,
        total_pages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getParqueaderoById(id) {
    const parqueadero = await this.parqueaderoRepository.findById(id);

    if (!parqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    return parqueadero.toResponse();
  }

  async getParqueaderosBySocio(socioId, activo) {
    const socio = await this.userRepository.findById(parseInt(socioId));

    if (!socio) {
      throw new SocioNotFoundException();
    }

    if (socio.role !== "SOCIO") {
      throw new SocioNotSocioRoleException();
    }

    const parqueaderos = await this.parqueaderoRepository.findBySocioId(
      socioId,
      activo
    );

    return {
      socio: {
        id: socio.id,
        fullname: socio.fullname,
        email: socio.email,
      },
      parqueaderos: parqueaderos.map((p) => p.toResponse()),
      total: parqueaderos.length,
    };
  }

  async getParqueaderosStats() {
    const stats = await this.parqueaderoRepository.getStatistics();
    return new ParqueaderosStatsDto(stats);
  }

  async createParqueadero(createData) {
    const createDto = new CreateParqueaderoDto(createData);

    const socio = await this.userRepository.findById(createDto.socioId);
    if (!socio) {
      throw new SocioNotFoundException();
    }

    if (socio.role !== "SOCIO") {
      throw new InvalidSocioRoleException();
    }

    const existingParqueadero = await this.parqueaderoRepository.findByName(
      createDto.nombre
    );
    if (existingParqueadero) {
      throw new ParqueaderoAlreadyExistsException();
    }

    const newParqueadero = await this.parqueaderoRepository.create(createDto);

    return new ParqueaderoResponseDto(
      newParqueadero,
      "Parqueadero created successfully"
    );
  }

  async updateParqueadero(id, updateData) {
    const updateDto = new UpdateParqueaderoDto(updateData);

    const existingParqueadero =
      await this.parqueaderoRepository.findByIdIncludingInactive(id);
    if (!existingParqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    if (
      updateDto.socioId &&
      updateDto.socioId !== existingParqueadero.socioId
    ) {
      const newSocio = await this.userRepository.findById(updateDto.socioId);
      if (!newSocio) {
        throw new SocioNotFoundException("New socio not found");
      }

      if (newSocio.role !== "SOCIO") {
        throw new InvalidSocioRoleException();
      }
    }

    if (updateDto.nombre && updateDto.nombre !== existingParqueadero.nombre) {
      const duplicateParqueadero = await this.parqueaderoRepository.findByName(
        updateDto.nombre,
        id
      );
      if (duplicateParqueadero) {
        throw new ParqueaderoAlreadyExistsException(
          "A parqueadero with this name already exists"
        );
      }
    }

    const updatedParqueadero = await this.parqueaderoRepository.update(
      id,
      updateDto
    );

    return new ParqueaderoResponseDto(
      updatedParqueadero,
      "Parqueadero updated successfully"
    );
  }

  async deleteParqueadero(id) {
    const existingParqueadero =
      await this.parqueaderoRepository.findByIdIncludingInactive(id);

    if (!existingParqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    if (!existingParqueadero.activo) {
      throw new ParqueaderoAlreadyExistsException(
        "El parqueadero ya está eliminado"
      );
    }

    const vehiculosActivos =
      await this.parqueaderoRepository.countActiveVehicles(id);

    if (vehiculosActivos > 0) {
      throw new ParqueaderoHasActiveVehiclesException(
        `No se puede eliminar el parqueadero. Hay ${vehiculosActivos} vehículo(s) actualmente parqueado(s).`
      );
    }

    const deletedParqueadero = await this.parqueaderoRepository.update(id, {
      activo: false,
    });

    return {
      id: deletedParqueadero.id,
      nombre: deletedParqueadero.nombre,
      activo: deletedParqueadero.activo,
      message: "Parqueadero eliminado exitosamente",
    };
  }

  async toggleParqueaderoStatus(id) {
    const existingParqueadero =
      await this.parqueaderoRepository.findByIdIncludingInactive(id);

    if (!existingParqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    const updatedParqueadero = await this.parqueaderoRepository.update(id, {
      activo: !existingParqueadero.activo,
    });

    const message = `Parqueadero ${
      updatedParqueadero.activo ? "activated" : "deactivated"
    } successfully`;

    return {
      id: updatedParqueadero.id,
      nombre: updatedParqueadero.nombre,
      activo: updatedParqueadero.activo,
      socio: updatedParqueadero.socio,
      message,
    };
  }
}
