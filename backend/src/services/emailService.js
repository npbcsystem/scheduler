import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
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
    console.log("Testing SMTP connection...");

    await transporter.verify();

    console.log("SMTP connection verified.");

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
    console.error(
      "EMAIL ERROR:",
      error.response || error.message
    );

    throw new Error("Unable to send email.");
  }
};