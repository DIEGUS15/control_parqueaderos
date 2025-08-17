import { VehiculoRepository } from "../repositories/vehiculoRepository.js";
import { ParqueaderoRepository } from "../repositories/parqueaderoRepository.js";
import { EmailService } from "./emailService.js";
import {
  RegistroIngresoDto,
  RegistroSalidaDto,
  VehiculoResponseDto,
} from "../dto/vehiculo.dto.js";
import {
  ParqueaderoNotFoundOrNoPermissionException,
  VehiculoAlreadyInParqueaderoException,
  ParqueaderoCapacityFullException,
  VehiculoNotInParqueaderoException,
} from "../exceptions/vehiculoExceptions.js";

export class VehiculoService {
  constructor() {
    this.vehiculoRepository = new VehiculoRepository();
    this.parqueaderoRepository = new ParqueaderoRepository();
    this.emailService = new EmailService();
  }

  async registrarIngreso(ingresoData, userId) {
    const { placa, parqueaderoId } = new RegistroIngresoDto(ingresoData);

    // Validar que el parqueadero pertenezca al socio
    const parqueadero = await this._validateParqueaderoBelongsToSocio(
      parqueaderoId,
      userId,
      true
    );

    // Validar que la placa NO esté actualmente en ningún parqueadero
    const vehiculoExistente = await this.vehiculoRepository.findActiveByPlaca(
      placa
    );
    if (vehiculoExistente) {
      throw new VehiculoAlreadyInParqueaderoException();
    }

    // Validar capacidad del parqueadero
    await this._validateParqueaderoCapacity(
      parqueaderoId,
      parqueadero.capacidad
    );

    // Crear el registro de ingreso
    const nuevoRegistro = await this.vehiculoRepository.createRegistroIngreso({
      placa,
      parqueaderoId,
    });

    // Enviar notificación por email (no interrumpe el flujo si falla)
    try {
      await this.emailService.sendIngresoNotification(
        parqueadero.socio.email,
        placa,
        parqueadero.nombre,
        parqueaderoId
      );
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // No lanzamos el error para que no interrumpa el flujo principal
    }

    return { id: nuevoRegistro.id };
  }

  async registrarSalida(salidaData, userId) {
    const { placa, parqueaderoId } = new RegistroSalidaDto(salidaData);

    // Validar que el parqueadero pertenezca al socio
    const parqueadero = await this._validateParqueaderoBelongsToSocio(
      parqueaderoId,
      userId,
      false
    );

    // Validar que la placa esté en el parqueadero
    const vehiculoEnParqueadero =
      await this.vehiculoRepository.findActiveByPlacaAndParqueadero(
        placa,
        parqueaderoId
      );
    if (!vehiculoEnParqueadero) {
      throw new VehiculoNotInParqueaderoException();
    }

    const fechaSalida = new Date();

    // Calcular el monto total usando la lógica del entity
    const montoTotal = vehiculoEnParqueadero.calculateTotalAmount(
      parqueadero.costoPorHora,
      fechaSalida
    );

    // Actualizar registros en la base de datos
    await this.vehiculoRepository.createHistorialAndUpdateRegistro(
      vehiculoEnParqueadero,
      fechaSalida,
      montoTotal
    );

    // Enviar notificación por email (no interrumpe el flujo si falla)
    try {
      await this.emailService.sendSalidaNotification(
        parqueadero.socio.email,
        placa,
        parqueadero.nombre,
        montoTotal,
        parqueaderoId
      );
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // No lanzamos el error para que no interrumpa el flujo principal
    }

    return { mensaje: "Salida registrada" };
  }

  async getVehiculos(parqueaderoId) {
    const parqueadero = await this.parqueaderoRepository.findById(
      parqueaderoId
    );
    if (!parqueadero) {
      throw new ParqueaderoNotFoundOrNoPermissionException(
        "Parqueadero not found"
      );
    }

    const vehiculos = await this.vehiculoRepository.findActiveByParqueadero(
      parqueaderoId
    );
    return vehiculos.map((vehiculo) => vehiculo.toPublic());
  }

  async getVehiculosSocio(parqueaderoId, userId) {
    // Validar que el parqueadero pertenezca al socio
    await this._validateParqueaderoBelongsToSocio(parqueaderoId, userId, false);

    const vehiculos = await this.vehiculoRepository.findActiveByParqueadero(
      parqueaderoId
    );
    return vehiculos.map((vehiculo) => vehiculo.toPublic());
  }

  // Métodos privados para validaciones comunes
  async _validateParqueaderoBelongsToSocio(
    parqueaderoId,
    userId,
    requiredActive = false
  ) {
    // Usar el repositorio en lugar de prisma directamente
    const parqueadero = await this.parqueaderoRepository.findById(
      parqueaderoId
    );

    if (!parqueadero) {
      throw new ParqueaderoNotFoundOrNoPermissionException();
    }

    // Verificar que pertenezca al socio
    if (parqueadero.socioId !== userId) {
      throw new ParqueaderoNotFoundOrNoPermissionException();
    }

    // Verificar si debe estar activo
    if (requiredActive && !parqueadero.activo) {
      throw new ParqueaderoNotFoundOrNoPermissionException();
    }

    return parqueadero;
  }

  async _validateParqueaderoCapacity(parqueaderoId, capacidadMaxima) {
    const vehiculosActivos =
      await this.vehiculoRepository.countActiveInParqueadero(parqueaderoId);

    if (vehiculosActivos >= capacidadMaxima) {
      throw new ParqueaderoCapacityFullException();
    }
  }
}
