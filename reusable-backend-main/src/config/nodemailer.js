// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;

import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  // 465 uses implicit TLS; 587/others typically use STARTTLS
  secure: smtpPort === 465,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
});

// Verify connection (important in production)
transporter.verify((error, _success) => {
  if (error) {
    logger.error("SMTP verification failed", { error });
  } else {
    logger.info("Email server is ready");
  }
});

export default transporter;
