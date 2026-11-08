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
  static async sendVerificationEmail(user, code) {
    return this.sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: emailVerificationTemplate(code),
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
  static async sendChangeEmailEmail(user, newEmail, token) {
    return this.sendEmail({
      to: newEmail,
      subject: "Verify New Email Address",
      html: changeEmailTemplate({ name: user.name, newEmail, token }),
    });
  }
  static async sendNewLoginAlert(user, { device, ip, location, time }) {
    return this.sendEmail({
      to: user.email,
      subject: "New Sign-in Detected",
      html: newLoginAlertTemplate({ name: user.name, device, ip, location, time }),
    });
  }
  static async sendPasswordChangeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Password Changed",
      html: passwordChangeTemplate({ name: user.name }),
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
