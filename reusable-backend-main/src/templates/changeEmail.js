export const changeEmailTemplate = ({
  name = "there",
  newEmail,
  verifyLink,
  expiresInMinutes = 10,
  appName = process.env.APP_NAME || "My App",
  supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_EMAIL || "support@example.com",
  currentEmail,
} = {}) => {
  const safeName = String(name || "there").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeNew = String(newEmail || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCurrent = currentEmail ? String(currentEmail).replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  const safeLink = String(verifyLink || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const displayLink = String(verifyLink || "").replace(/&/g, "&amp;");
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify new email - ${appName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F4F5F7; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <tr>
                <td style="padding: 32px 40px 24px 40px; text-align: left; border-bottom: 1px solid #F0F0F0;">
                  <span style="font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">${appName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 40px; color: #374151; font-size: 15px; line-height: 1.6;">
                  <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #111827;">Verify your new email address</h1>
                  <p style="margin: 0 0 16px 0;">Hi ${safeName},</p>
                  <p style="margin: 0 0 16px 0;">We received a request to change ${safeCurrent ? `the email for <strong>${safeCurrent}</strong>` : "your account email"} to <strong>${safeNew}</strong>.</p>
                  <p style="margin: 0 0 16px 0;">Confirm this change by verifying the new email address. Your current email will not be replaced until verification succeeds.</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin: 24px 0;">
                    <tr>
                      <td align="center" bgcolor="#4F46E5" style="border-radius: 6px;">
                        <a href="${safeLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-weight: 600; font-size: 15px; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif;">Verify New Email</a>
                      </td>
                    </tr>
                  </table>
                  <div style="clear: both;"></div>
                  <p style="margin: 8px 0 12px 0; font-size: 14px; color: #475569;">This verification link expires in <strong>${expiresInMinutes} minute${expiresInMinutes === 1 ? "" : "s"}</strong>.</p>
                  <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280;">If the button does not work, copy and paste this link:</p>
                  <a href="${safeLink}" style="display: block; padding: 12px; background: #f1f5f9; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 13px; color: #0f172a; word-break: break-all; border: 1px solid #d1d9e6; text-decoration: none;">${displayLink}</a>
                  <p style="margin: 20px 0 0 0; font-size: 13px; color: #6B7280;">If you did not request this change, you can ignore this email and your current email address will remain unchanged. For help, contact <a href="mailto:${supportEmail}" style="color: #4F46E5; text-decoration: underline;">${supportEmail}</a>.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
