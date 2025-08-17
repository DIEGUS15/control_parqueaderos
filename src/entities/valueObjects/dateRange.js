export class DateRange {
  constructor() {
    this.ahora = new Date();
    this.hoy = new Date(
      this.ahora.getFullYear(),
      this.ahora.getMonth(),
      this.ahora.getDate()
    );
    this.inicioSemana = new Date(this.hoy);
    this.inicioSemana.setDate(this.hoy.getDate() - this.hoy.getDay());
    this.inicioMes = new Date(
      this.ahora.getFullYear(),
      this.ahora.getMonth(),
      1
    );
    this.inicioAno = new Date(this.ahora.getFullYear(), 0, 1);
    this.manana = new Date(this.hoy.getTime() + 24 * 60 * 60 * 1000);
  }

  getTodayRange() {
    return {
      gte: this.hoy,
      lt: this.manana,
    };
  }

  getWeekRange() {
    return { gte: this.inicioSemana };
  }

  getMonthRange() {
    return { gte: this.inicioMes };
  }

  getYearRange() {
    return { gte: this.inicioAno };
  }
}
