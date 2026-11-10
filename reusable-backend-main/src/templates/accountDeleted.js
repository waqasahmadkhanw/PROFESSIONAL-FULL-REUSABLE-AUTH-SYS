export const accountDeletedTemplate = ({
  name = "there",
  appName = process.env.APP_NAME || "My App",
  supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_EMAIL || "support@example.com",
} = {}) => {
  const safeName = String(name || "there").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Deleted - ${appName}</title>
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
                  <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #DC2626;">Account deleted</h1>
                  <p style="margin: 0 0 16px 0;">Hi ${safeName},</p>
                  <p style="margin: 0 0 16px 0;">Your ${appName} account has been permanently closed. Your personal profile data has been removed or anonymized where required. Certain records (such as orders, payments, and required audit history) may be retained where legally or operationally necessary.</p>
                  <p style="margin: 0 0 16px 0;">If you did not request this, contact <a href="mailto:${supportEmail}" style="color: #4F46E5; text-decoration: underline;">${supportEmail}</a> immediately.</p>
                  <p style="margin: 0; font-size: 13px; color: #9CA3AF;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
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
