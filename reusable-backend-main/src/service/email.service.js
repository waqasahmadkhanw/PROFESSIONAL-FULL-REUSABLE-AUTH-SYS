import transporter from "../config/nodemailer.js";
import { emailVerificationTemplate } from "../templates/verifyEmail.js";
import { resetPasswordTemplate } from "../templates/forgotPasswordEmail.js";
import { welcomeEmailTemplate } from "../templates/welcomeEmail.js";
import { accountDeactivatedTemplate } from "../templates/accountDeactivated.js";
import { accountDeletedTemplate } from "../templates/accountDeleted.js";
import { accountRestoredTemplate } from "../templates/accountRestored.js";
import { changeEmailTemplate } from "../templates/changeEmail.js";
import { newLoginAlertTemplate } from "../templates/newLoginAlert.js";
import { passwordChangeTemplate } from "../templates/passwordChange.js";
import { suspiciousLoginAlertTemplate } from "../templates/suspiciousLoginAlert.js";

const from = `"${process.env.APP_NAME || "My App"}" <${process.env.SMTP_EMAIL || process.env.EMAIL_USER || "no-reply@example.com"}>`;

class EmailService {
  static async sendEmail({ to, subject, html }) {
    return transporter.sendMail({ from, to, subject, html });
  }
  static async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: `Welcome to ${process.env.APP_NAME || "My App"}`,
      html: welcomeEmailTemplate({ name: user.name }),
    });
  }
  static async sendVerificationEmail(user, verifyLink, expiresInMinutes = 10) {
    return this.sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: emailVerificationTemplate({
        name: user.name,
        verifyLink,
        expiresInMinutes,
      }),
    });
  }
  static async sendResetPasswordEmail(user, resetLink) {
    return this.sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: resetPasswordTemplate(resetLink),
    });
  }
  static async sendAccountDeactivatedEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Account Deactivated",
      html: accountDeactivatedTemplate({ name: user.name }),
    });
  }
  static async sendAccountDeletedEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Account Deleted",
      html: accountDeletedTemplate({ name: user.name }),
    });
  }
  static async sendAccountRestoredEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Account Restored",
      html: accountRestoredTemplate({ name: user.name }),
    });
  }
  static async sendChangeEmailEmail({ to, name, verifyLink, expiresInMinutes = 10, currentEmail }) {
    return this.sendEmail({
      to,
      subject: "Verify your new email address",
      html: changeEmailTemplate({ name, verifyLink, expiresInMinutes, newEmail: to, currentEmail }),
    });
  }

  static async sendEmailChangeNotification({ to, name, newEmail }) {
    return this.sendEmail({
      to,
      subject: "Your account email was changed",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin: 0 0 12px;">Email address updated</h2>
          <p style="margin: 0 0 8px;">Hi ${String(name || "there").replace(/</g, "&lt;").replace(/>/g, "&gt;")},</p>
          <p style="margin: 0 0 8px;">Your account email address was changed to <strong>${String(newEmail || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</strong>.</p>
          <p style="margin: 0;">If you did not make this change, please contact support immediately and secure your account.</p>
        </div>
      `,
    });
  }
  static async sendNewLoginAlert(user, { device, ip, location, time }) {
    return this.sendEmail({
      to: user.email,
      subject: "New Sign-in Detected",
      html: newLoginAlertTemplate({ name: user.name, device, ip, location, time }),
    });
  }
  static async sendPasswordChangeEmail(user, meta = {}) {
    return this.sendEmail({
      to: user.email,
      subject: "Security alert: Password changed",
      html: passwordChangeTemplate({
        name: user.name,
        changedAt: meta.changedAt || new Date().toISOString(),
      }),
    });
  }
  static async sendSuspiciousLoginAlert(user, { device, ip, location, time }) {
    return this.sendEmail({
      to: user.email,
      subject: "Suspicious Sign-in Detected",
      html: suspiciousLoginAlertTemplate({ name: user.name, device, ip, location, time }),
    });
  }
}
export default EmailService;
