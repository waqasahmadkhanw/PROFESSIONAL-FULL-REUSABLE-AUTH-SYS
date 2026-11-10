export const newLoginAlertTemplate = ({
  name = "there",
  device,
  ip,
  location,
  time,
  appName = process.env.APP_NAME || "My App",
} = {}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Login Alert - ${appName}</title>
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
                  <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #111827;">New Sign-in Detected</h1>
                  <p style="margin: 0 0 16px 0;">Hi ${name},</p>
                  <p style="margin: 0 0 16px 0;">We detected a new sign-in to your account.</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F9FAFB; border-radius: 6px; padding: 20px; margin: 0 0 16px 0;">
                    <tr>
                      <td style="font-size: 13px; color: #6B7280; padding-bottom: 8px;">Device</td>
                      <td style="font-size: 15px; color: #111827; font-weight: 500;">${device}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #6B7280; padding-bottom: 8px;">Location</td>
                      <td style="font-size: 15px; color: #111827; font-weight: 500;">${location}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #6B7280; padding-bottom: 8px;">IP Address</td>
                      <td style="font-size: 15px; color: #111827; font-weight: 500;">${ip}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #6B7280; padding-bottom: 8px;">Time</td>
                      <td style="font-size: 15px; color: #111827; font-weight: 500;">${time}</td>
                    </tr>
                  </table>
                  <p style="margin: 0; font-size: 13px; color: #6B7280;">If this was you, you can ignore this email. If not, please secure your account immediately.</p>
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
