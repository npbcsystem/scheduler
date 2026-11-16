import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  dnsTimeout: 5_000,
  connectionTimeout: 5_000,
  greetingTimeout: 5_000,
  socketTimeout: 10_000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"NPBC Scheduler" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("EMAIL SENT:", info.messageId);

    return info;
  } catch (error) {
    console.error("EMAIL ERROR:", {
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
    });
    throw new Error("Unable to send email.");
  }
};
