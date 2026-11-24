import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

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

function smtpConfigurado(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

const REMITENTE = `"CVR Propiedades" <${process.env.SMTP_USER ?? ""}>`;

/** Escapa el texto que escribe el usuario antes de interpolarlo en HTML. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const PIE = `
  <p style="margin:0;font-size:11px;color:#4a6080;line-height:1.8;">
    ${SITE.legalName} · RUT 78.342.064-3<br>
    ${SITE.city}, ${SITE.region}, Chile<br>
    ${SITE.email} · ${SITE.phoneDisplay}
  </p>`;

/**
 * Envía la estimación referencial automática al solicitante.
 *
 * El asunto y el cuerpo dejan claro que es una estimación y no el informe
 * firmado, y que no sirve para trámites. La firma del perito no aparece acá
 * porque este documento nadie lo revisó.
 */
export async function sendEstimacionReferencial(opts: {
  to: string;
  clientName: string;
  tasacionId: string;
  pdfBytes: Uint8Array;
}) {
  if (!smtpConfigurado()) {
    console.warn("[mailer] SMTP_USER/SMTP_PASS no configurados: no se envía el correo.");
    return { skipped: true };
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#050c17;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="background:#050c17;border-bottom:3px solid #c9a84c;padding:28px 40px;">
          <span style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-1px;">CVR</span>
          <span style="font-size:11px;color:#8fa3bc;letter-spacing:3px;text-transform:uppercase;margin-left:8px;">Propiedades</span>
        </td></tr>

        <tr><td style="padding:36px 40px;color:#f0f4f8;">
          <p style="font-size:20px;font-weight:700;margin:0 0 16px;color:#c9a84c;">Tu estimación referencial</p>
          <p style="margin:0 0 16px;color:#8fa3bc;line-height:1.7;">
            Hola <strong style="color:#f0f4f8;">${opts.clientName}</strong>,<br><br>
            Adjuntamos la estimación referencial calculada a partir de los datos que ingresaste.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1f36;border-radius:8px;margin:0 0 24px;">
            <tr><td style="padding:18px;">
              <p style="margin:0 0 4px;font-size:11px;color:#4a6080;text-transform:uppercase;letter-spacing:1px;">Número de solicitud</p>
              <p style="margin:0;font-family:monospace;font-size:14px;color:#f0f4f8;word-break:break-all;">${opts.tasacionId}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 12px;padding:14px;border-left:3px solid #c9a84c;background:#0d1f36;color:#8fa3bc;font-size:13px;line-height:1.7;">
            <strong style="color:#f0f4f8;">Esto no es una tasación.</strong>
            Es un cálculo automático, sin inspección del inmueble ni revisión profesional.
            No sirve para trámites bancarios, judiciales, hereditarios ni de compraventa.
            Para eso se necesita un informe de tasación con inspección y firma.
          </p>

          <p style="margin:0 0 8px;font-size:13px;color:#8fa3bc;line-height:1.8;">
            Si encargaste el informe firmado, el equipo trabaja en la revisión del inmueble y
            te contactará para coordinar la inspección.
          </p>
          <a href="https://wa.me/${SITE.phoneE164}?text=Hola%20CVR%2C%20tengo%20una%20consulta%20sobre%20la%20solicitud%20${opts.tasacionId}"
            style="display:inline-block;margin-top:16px;background:#c9a84c;color:#050c17;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Consultar por WhatsApp
          </a>
        </td></tr>

        <tr><td style="background:#091628;padding:22px 40px;border-top:1px solid rgba(255,255,255,0.06);">
          ${PIE}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getTransporter().sendMail({
    from: REMITENTE,
    to: opts.to,
    subject: "Tu estimación referencial de valor — CVR Propiedades",
    html,
    attachments: [
      {
        filename: `Estimacion_Referencial_${opts.tasacionId.slice(0, 10)}.pdf`,
        content: Buffer.from(opts.pdfBytes),
        contentType: "application/pdf",
      },
    ],
  });

  return { sent: true };
}

export interface ConsultaEntrante {
  nombre: string;
  email: string;
  telefono?: string;
  motivo: string;
  mensaje: string;
  origen: string;
}

/**
 * Aviso interno de una consulta del sitio. Responde a la casilla de contacto de
 * CVR, con reply-to del interesado. No se guarda en la base: el sitio no tiene
 * todavía un modelo de consultas y no se migra el esquema sin autorización.
 */
export async function sendConsultaInterna(c: ConsultaEntrante) {
  if (!smtpConfigurado()) {
    console.warn("[mailer] SMTP no configurado: consulta no enviada.");
    return { skipped: true };
  }

  const destino = process.env.CONTACT_EMAIL ?? SITE.email;

  const html = `<!DOCTYPE html>
<html lang="es"><body style="font-family:Arial,sans-serif;color:#111;line-height:1.6;">
  <h2 style="margin:0 0 12px;">Nueva consulta desde ${SITE.domain}</h2>
  <p style="margin:0 0 6px;"><strong>Origen:</strong> ${esc(c.origen)}</p>
  <p style="margin:0 0 6px;"><strong>Nombre:</strong> ${esc(c.nombre)}</p>
  <p style="margin:0 0 6px;"><strong>Correo:</strong> ${esc(c.email)}</p>
  <p style="margin:0 0 6px;"><strong>Teléfono:</strong> ${esc(c.telefono || "no indicado")}</p>
  <p style="margin:0 0 6px;"><strong>Motivo:</strong> ${esc(c.motivo)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
  <p style="white-space:pre-wrap;margin:0 0 16px;">${esc(c.mensaje)}</p>
  ${PIE}
</body></html>`;

  await getTransporter().sendMail({
    from: REMITENTE,
    to: destino,
    replyTo: c.email,
    subject: `Consulta web: ${c.motivo} — ${c.nombre}`,
    text: `${c.origen}\n${c.nombre} <${c.email}> ${c.telefono ?? ""}\n${c.motivo}\n\n${c.mensaje}`,
    html,
  });

  return { sent: true };
}
