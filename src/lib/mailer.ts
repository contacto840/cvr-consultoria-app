import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendTasacionReport(opts: {
  to: string;
  clientName: string;
  tasacionId: string;
  pdfBytes: Uint8Array;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[mailer] SMTP_USER/SMTP_PASS not set — skipping email send");
    return { skipped: true };
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"CVR Consultoría Predial" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: "Tu Informe Oficial de Tasación — CVR Consultoría Predial",
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#050c17;border-radius:12px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr><td style="background:#050c17;border-bottom:3px solid #c5a85b;padding:32px 40px;">
          <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-1px;">CVR</span>
          <span style="font-size:11px;color:#8fa3bc;letter-spacing:3px;text-transform:uppercase;margin-left:8px;">Consultoría Predial</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;color:#f0f4f8;">
          <p style="font-size:22px;font-weight:700;margin:0 0 16px;color:#c5a85b;">¡Tu informe está listo!</p>
          <p style="margin:0 0 20px;color:#8fa3bc;line-height:1.7;">
            Hola <strong style="color:#f0f4f8;">${opts.clientName}</strong>,<br><br>
            Tu <strong style="color:#f0f4f8;">Informe Oficial de Tasación</strong> ha sido emitido y firmado.
            Encuéntralo adjunto a este correo en formato PDF.
          </p>

          <!-- ID Box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1f36;border-radius:8px;margin-bottom:28px;">
            <tr><td style="padding:20px;">
              <p style="margin:0 0 4px;font-size:11px;color:#4a6080;text-transform:uppercase;letter-spacing:1px;">ID de Solicitud</p>
              <p style="margin:0;font-family:monospace;font-size:15px;color:#f0f4f8;word-break:break-all;">${opts.tasacionId}</p>
            </td></tr>
          </table>

          <!-- Info List -->
          <p style="margin:0 0 12px;font-size:13px;color:#8fa3bc;">Este informe incluye:</p>
          <ul style="margin:0 0 28px;padding-left:20px;color:#8fa3bc;line-height:2;font-size:13px;">
            <li>Valorización referencial en UF y pesos chilenos</li>
            <li>Rango mínimo y máximo de mercado</li>
            <li>Datos de la propiedad y condición</li>
            <li>Firma del perito tasador certificado</li>
            <li>Validez para bancos, notarías y tribunales</li>
          </ul>

          <p style="margin:0 0 8px;font-size:13px;color:#8fa3bc;">¿Necesitas algo más?</p>
          <a href="https://wa.me/56938689157?text=Hola%20CVR%2C%20tengo%20una%20consulta%20sobre%20mi%20informe%20${opts.tasacionId}"
            style="display:inline-block;background:#c5a85b;color:#050c17;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Consultar por WhatsApp →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#091628;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:11px;color:#4a6080;line-height:1.8;">
            CVR Consultoría Predial · Chillán, Región de Ñuble, Chile<br>
            contacto@cvrpropiedades.com · +56 9 3868 9157<br>
            <em>Sin conflicto de interés — no somos corredores ni vendedores.</em>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    attachments: [
      {
        filename: `Tasacion_CVR_${opts.tasacionId.slice(0, 10)}.pdf`,
        content: Buffer.from(opts.pdfBytes),
        contentType: "application/pdf",
      },
    ],
  });

  return { sent: true };
}
