export const changeEmailTemplate = ({
  name = "there",
  newEmail,
  appName = process.env.APP_NAME || "My App",
  webUrl = process.env.WEB_URL || "http://localhost:3000",
  supportEmail = "support@example.com",
  token,
} = {}) => {
  const verifyLink = `${webUrl}/verify-email-change?token=${encodeURIComponent(token || "")}`;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Change Email - ${appName}</title>
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
                  <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #111827;">Change Email Address</h1>
                  <p style="margin: 0 0 16px 0;">Hi ${name},</p>
                  <p style="margin: 0 0 16px 0;">You requested to change your email address to <strong>${newEmail}</strong>.</p>
                  <p style="margin: 0 0 16px 0;">Please verify the new email address by clicking the button below.</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                    <tr>
                      <td align="left">
                        <a href="${verifyLink}" target="_blank" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-weight: 600; font-size: 15px; padding: 12px 28px; text-decoration: none; border-radius: 6px;">Verify New Email</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 0; font-size: 13px; color: #6B7280;">If you didn't request this change, contact us at <a href="mailto:${supportEmail}" style="color: #4F46E5; text-decoration: underline;">${supportEmail}</a>.</p>
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
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
