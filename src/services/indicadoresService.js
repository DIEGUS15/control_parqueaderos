import { IndicadoresRepository } from "../repositories/indicadoresRepository.js";
import { VehiculoFrequency } from "../entities/valueObjects/vehiculoFrequency.js";
import { DateRange } from "../entities/valueObjects/dateRange.js";
import {
  SearchVehiculosDto,
  VehiculoSearchResultDto,
  GananciasParqueaderoDto,
  VehiculoPrimeraVezDto,
  SearchResponseDto,
} from "../dto/indicadores.dto.js";
import {
  ParqueaderoNotFoundException,
  ParqueaderoPermissionDeniedException,
  SearchParameterRequiredException,
} from "../exceptions/indicadoresExceptions.js";

export class IndicadoresService {
  constructor() {
    this.indicadoresRepository = new IndicadoresRepository();
  }

  async getTop10VehiculosFrecuentes() {
    // Obtener todas las placas de ambas tablas
    const [historialVehiculos, registroVehiculos] = await Promise.all([
      this.indicadoresRepository.getAllHistorialPlacas(),
      this.indicadoresRepository.getAllRegistroPlacas(),
    ]);

    // Combinar todas las placas
    const todasLasPlacas = [
      ...historialVehiculos.map((v) => v.placa),
      ...registroVehiculos.map((v) => v.placa),
    ];

    // Usar value object para procesar frecuencias
    const frequencies = VehiculoFrequency.fromPlacasArray(todasLasPlacas);
    return VehiculoFrequency.getTop10(frequencies);
  }

  async getTop10VehiculosFrecuentesParqueadero(parqueaderoId) {
    // Validar que el parqueadero existe
    const parqueadero = await this.indicadoresRepository.findParqueaderoById(
      parqueaderoId
    );
    if (!parqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    // Obtener placas del parqueadero específico
    const [historialVehiculos, registroVehiculos] = await Promise.all([
      this.indicadoresRepository.getHistorialPlacasByParqueadero(parqueaderoId),
      this.indicadoresRepository.getRegistroPlacasByParqueadero(parqueaderoId),
    ]);

    // Combinar todas las placas de este parqueadero
    const todasLasPlacas = [
      ...historialVehiculos.map((v) => v.placa),
      ...registroVehiculos.map((v) => v.placa),
    ];

    // Usar value object para procesar frecuencias
    const frequencies = VehiculoFrequency.fromPlacasArray(todasLasPlacas);
    const top10 = VehiculoFrequency.getTop10(frequencies);

    // Agregar información del parqueadero
    return top10.map((freq) => ({
      ...freq,
      parqueadero: {
        id: parqueadero.id,
        nombre: parqueadero.nombre,
      },
    }));
  }

  async getVehiculosPrimeraVez(parqueaderoId) {
    // Validar que el parqueadero existe
    const parqueadero = await this.indicadoresRepository.findParqueaderoById(
      parqueaderoId
    );
    if (!parqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    // Obtener datos necesarios
    const [vehiculosActivos, placasHistoricas, placasRegistroPrevias] =
      await Promise.all([
        this.indicadoresRepository.getVehiculosActivosByParqueadero(
          parqueaderoId
        ),
        this.indicadoresRepository.getPlacasHistoricasDistinctByParqueadero(
          parqueaderoId
        ),
        this.indicadoresRepository.getPlacasRegistroPreviasByParqueadero(
          parqueaderoId
        ),
      ]);

    // Crear set de placas que ya han estado antes
    const placasQueYaEstuvieron = new Set([
      ...placasHistoricas.map((v) => v.placa),
      ...placasRegistroPrevias.map((v) => v.placa),
    ]);

    // Filtrar vehículos que están por primera vez
    const vehiculosPrimeraVez = vehiculosActivos.filter(
      (vehiculo) => !placasQueYaEstuvieron.has(vehiculo.placa)
    );

    // Convertir a DTOs
    return vehiculosPrimeraVez.map(
      (vehiculo) => new VehiculoPrimeraVezDto(vehiculo, parqueadero)
    );
  }

  async getGananciasParqueadero(parqueaderoId, userId) {
    // Verificar que el parqueadero existe y pertenece al socio logueado
    const parqueadero =
      await this.indicadoresRepository.findParqueaderoWithSocio(
        parqueaderoId,
        userId
      );
    if (!parqueadero) {
      throw new ParqueaderoPermissionDeniedException();
    }

    const dateRange = new DateRange();

    // Obtener ganancias para todos los períodos
    const [gananciaHoy, gananciaSemana, gananciaMes, gananciaAno] =
      await Promise.all([
        this.indicadoresRepository.getGananciasByParqueaderoAndDateRange(
          parqueaderoId,
          dateRange.getTodayRange()
        ),
        this.indicadoresRepository.getGananciasByParqueaderoAndDateRange(
          parqueaderoId,
          dateRange.getWeekRange()
        ),
        this.indicadoresRepository.getGananciasByParqueaderoAndDateRange(
          parqueaderoId,
          dateRange.getMonthRange()
        ),
        this.indicadoresRepository.getGananciasByParqueaderoAndDateRange(
          parqueaderoId,
          dateRange.getYearRange()
        ),
      ]);

    const ganancias = {
      hoy: gananciaHoy._sum.montoTotal,
      estaSemana: gananciaSemana._sum.montoTotal,
      esteMes: gananciaMes._sum.montoTotal,
      esteAno: gananciaAno._sum.montoTotal,
    };

    return new GananciasParqueaderoDto(parqueadero, ganancias, dateRange.ahora);
  }

  async buscarVehiculosPorPlaca(busquedaParams) {
    const searchDto = new SearchVehiculosDto(busquedaParams);

    const vehiculosEncontrados =
      await this.indicadoresRepository.searchVehiculosActivos(
        searchDto.terminoBusqueda
      );

    // Convertir a DTOs
    const vehiculosDto = vehiculosEncontrados.map(
      (vehiculo) => new VehiculoSearchResultDto(vehiculo, vehiculo.parqueadero)
    );

    return new SearchResponseDto(searchDto.terminoBusqueda, vehiculosDto);
  }

  async buscarVehiculosPorPlacaParqueadero(parqueaderoId, busquedaParams) {
    const searchDto = new SearchVehiculosDto(busquedaParams);

    // Verificar que el parqueadero existe
    const parqueadero = await this.indicadoresRepository.findParqueaderoById(
      parqueaderoId
    );
    if (!parqueadero) {
      throw new ParqueaderoNotFoundException();
    }

    const vehiculosEncontrados =
      await this.indicadoresRepository.searchVehiculosActivosByParqueadero(
        parqueaderoId,
        searchDto.terminoBusqueda
      );

    // Convertir a DTOs
    const vehiculosDto = vehiculosEncontrados.map(
      (vehiculo) =>
        new VehiculoSearchResultDto(vehiculo, {
          id: parqueadero.id,
          nombre: parqueadero.nombre,
          direccion: parqueadero.direccion,
        })
    );

    return new SearchResponseDto(searchDto.terminoBusqueda, vehiculosDto, {
      id: parqueadero.id,
      nombre: parqueadero.nombre,
      direccion: parqueadero.direccion,
    });
  }
}
