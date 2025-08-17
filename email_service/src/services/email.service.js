export class EmailService {
  async sendSimulatedEmail(data) {
    console.log("Solicitud de email recibida:", JSON.stringify(data, null, 2));

    return { mensaje: "Correo Enviado" };
  }
}
