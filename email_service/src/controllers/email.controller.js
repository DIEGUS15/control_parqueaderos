import { EmailService } from "../services/email.service.js";

const emailService = new EmailService();

export const sendEmail = async (req, res) => {
  const { email, placa, mensaje, parqueaderoNombre, parqueaderoId } = req.body;

  if (!email || !placa || !mensaje) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const result = await emailService.sendSimulatedEmail({
      email,
      placa,
      mensaje,
      parqueaderoNombre:
        parqueaderoNombre || `Parqueadero ID: ${parqueaderoId}`,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};
