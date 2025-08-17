export class EmailService {
  constructor() {
    this.emailServiceUrl =
      process.env.EMAIL_SERVICE_URL || "http://localhost:3001/email/send";
  }

  async sendNotification(emailData) {
    try {
      const response = await fetch(this.emailServiceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      console.log("Respuesta del servicio de email:", result);
      return result;
    } catch (error) {
      console.error("Error llamando al servicio de email:", error);
      return null;
    }
  }

  async sendIngresoNotification(
    socioEmail,
    placa,
    parqueaderoNombre,
    parqueaderoId
  ) {
    const emailData = {
      email: socioEmail,
      placa: placa,
      mensaje: `Se ha registrado el ingreso del vehículo con placa ${placa} al parqueadero ${parqueaderoNombre}`,
      parqueaderoId: parqueaderoId,
    };

    return await this.sendNotification(emailData);
  }

  async sendSalidaNotification(
    socioEmail,
    placa,
    parqueaderoNombre,
    montoTotal,
    parqueaderoId
  ) {
    const emailData = {
      email: socioEmail,
      placa: placa,
      mensaje: `Se ha registrado la salida del vehículo con placa ${placa} del parqueadero ${parqueaderoNombre}. Monto total: $${montoTotal}`,
      parqueaderoId: parqueaderoId,
    };

    return await this.sendNotification(emailData);
  }
}
