import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

const smtpPort = Number(process.env.SMTP_PORT) || 587;
// Gmail app passwords are displayed in 4-char groups separated by spaces (e.g.
// "abcd efgh ijkl mnop"). Nodemailer/Google reject the spaced form, so strip all
// whitespace from credentials before use.
const clean = (value) => String(value || "").replace(/\s+/g, "");
const smtpUser = clean(process.env.SMTP_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER);
const smtpPass = clean(process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.SMTP_PASS);
const smtpHost = process.env.SMTP_HOST;

const hasCredentials = Boolean(smtpUser && smtpPass);

if (!smtpHost || !hasCredentials) {
  logger.warn("SMTP is not fully configured — outbound email will fail", {
    hasHost: Boolean(smtpHost),
    hasUser: Boolean(smtpUser),
    hasPass: Boolean(smtpPass),
    hint: "Set SMTP_HOST, SMTP_EMAIL (or EMAIL_USER) and SMTP_PASSWORD (or EMAIL_PASS) in .env",
  });
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  // 465 uses implicit TLS; 587/others typically use STARTTLS
  secure: smtpPort === 465,
  auth: hasCredentials ? { user: smtpUser, pass: smtpPass } : undefined,
  tls: {
    // Allow self-signed certificates in development; reject in production
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

// Verify connection (important in production). Logs a clear, actionable error
// when credentials are rejected so misconfiguration is immediately visible.
transporter.verify((error, _success) => {
  if (error) {
    logger.error("SMTP verification failed — email sending is disabled until fixed", {
      error: error.message,
      host: smtpHost,
      user: smtpUser,
      hint:
        "For Gmail, enable 2-Step Verification and create an App Password, then set SMTP_PASSWORD to that 16-char password (spaces are stripped automatically).",
    });
  } else {
    logger.info("Email server is ready", { host: smtpHost, user: smtpUser });
  }
});

export default transporter;