export class SearchVehiculosDto {
  constructor({ busqueda }) {
    if (!busqueda || busqueda.trim() === "") {
      throw new Error("El parámetro 'busqueda' es requerido");
    }
    this.terminoBusqueda = busqueda.trim().toUpperCase();
  }
}

export class VehiculoSearchResultDto {
  constructor(vehiculo, parqueadero) {
    this.id = vehiculo.id;
    this.placa = vehiculo.placa;
    this.fechaIngreso = vehiculo.fechaIngreso;
    this.parqueadero = {
      id: parqueadero.id,
      nombre: parqueadero.nombre,
      direccion: parqueadero.direccion,
    };
  }
}

export class GananciasParqueaderoDto {
  constructor(parqueadero, ganancias, fechaConsulta) {
    this.parqueadero = {
      id: parqueadero.id,
      nombre: parqueadero.nombre,
    };
    this.ganancias = {
      hoy: Number(ganancias.hoy || 0),
      estaSemana: Number(ganancias.estaSemana || 0),
      esteMes: Number(ganancias.esteMes || 0),
      esteAno: Number(ganancias.esteAno || 0),
    };
    this.fechaConsulta = fechaConsulta;
  }
}

export class VehiculoPrimeraVezDto {
  constructor(vehiculo, parqueadero) {
    this.id = vehiculo.id;
    this.placa = vehiculo.placa;
    this.fechaIngreso = vehiculo.fechaIngreso;
    this.parqueadero = {
      id: parqueadero.id,
      nombre: parqueadero.nombre,
    };
  }
}

export class SearchResponseDto {
  constructor(terminoBusqueda, vehiculos, parqueadero = null) {
    this.terminoBusqueda = terminoBusqueda;
    this.cantidadEncontrados = vehiculos.length;
    this.vehiculos = vehiculos;

    if (parqueadero) {
      this.parqueadero = parqueadero;
    }
  }
}
