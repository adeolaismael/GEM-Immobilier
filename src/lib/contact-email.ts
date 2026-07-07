type ContactEmailData = {
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string | null;
  message: string;
  service: string | null;
  bienTitre: string | null;
  receivedAt: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;color:#6b7280;font-size:14px;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
    </tr>
  `;
}

export function buildContactEmailHtml(data: ContactEmailData): string {
  const rows = [
    row("Nom et prénom", data.nom),
    row("Email", data.email),
    data.telephone ? row("Téléphone", data.telephone) : "",
    data.service ? row("Service concerné", data.service) : "",
    data.bienTitre ? row("Bien concerné", data.bienTitre) : "",
  ].join("");

  return `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nouveau message contact</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#8a8f00;padding:28px 32px;text-align:center;">
                <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.08em;line-height:1.2;">
                  GEM<br />IMMOBILIER
                </div>
                <div style="margin-top:12px;color:#f3f4f6;font-size:14px;">
                  Nouveau message depuis le site
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 8px;font-size:20px;color:#111827;">
                  ${escapeHtml(data.sujet?.trim() || "Sans sujet")}
                </h1>
                <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">
                  Reçu le ${escapeHtml(data.receivedAt)}
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;">
                  ${rows}
                </table>
                <div style="margin-top:28px;padding:20px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
                  <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">
                    Message
                  </p>
                  <p style="margin:0;color:#111827;font-size:14px;line-height:1.7;white-space:pre-wrap;">
                    ${escapeHtml(data.message)}
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:12px;">
                GEM Immobilier — Notification automatique du formulaire de contact
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}
