export const emailVerificationTemplate = ({
  name = "there",
  verifyLink,
  expiresInMinutes = 10,
  appName = process.env.APP_NAME || "My App",
  supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_EMAIL || "support@example.com",
} = {}) => {
  const safeLink = String(verifyLink || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const displayLink = String(verifyLink || "").replace(/&/g, "&amp;");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email - ${appName}</title>
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
                  <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #111827;">
                    Verify your email address
                  </h1>
                  <p style="margin: 0 0 16px 0;">
                    Hi ${String(name || "there").replace(/</g, "&lt;").replace(/>/g, "&gt;")},
                  </p>
                  <p style="margin: 0 0 16px 0;">
                    Thanks for creating an account with <strong>${appName}</strong>. Please confirm your email address by clicking the button below.
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin: 28px 0;">
                    <tr>
                      <td align="center" bgcolor="#4F46E5" style="border-radius: 6px;">
                        <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeLink}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="13%" fillcolor="#4F46E5" stroke="f">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">Verify Email</center>
                        </v:roundrect>
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <a href="${safeLink}"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-weight: 600; font-size: 15px; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif;">
                          Verify Email
                        </a>
                        <!--<![endif]-->
                      </td>
                    </tr>
                  </table>
                  <div style="clear: both;"></div>
                  <div style="background: #f8fafc; border-left: 4px solid #4F46E5; padding: 14px 16px; border-radius: 4px; margin: 8px 0 20px 0;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e293b;">
                      This verification link expires in <strong>${expiresInMinutes} minute${expiresInMinutes === 1 ? "" : "s"}</strong>. If it expires, you can request a new verification email from the sign-in page.
                    </p>
                  </div>
                  <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">
                    If the button does not work, copy and paste this link into your browser:
                  </p>
                  <a href="${safeLink}" style="display: block; padding: 12px; background: #f1f5f9; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 13px; color: #0f172a; word-break: break-all; border: 1px solid #d1d9e6; text-decoration: none;">
                    ${displayLink}
                  </a>
                  <p style="margin: 20px 0 0 0; font-size: 13px; color: #6B7280;">
                    If you did not create an account with ${appName}, you can safely ignore this email. No account will be verified and no further action is required.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #F0F0F0; font-size: 13px; color: #9CA3AF; text-align: left;">
                  <p style="margin: 0 0 8px 0;">
                    Need help? Contact us at <a href="mailto:${supportEmail}" style="color: #6B7280; text-decoration: underline;">${supportEmail}</a>.
                  </p>
                  <p style="margin: 0;">
                    &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
                  </p>
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
