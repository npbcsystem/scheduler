import dotenv from "dotenv";
import { sendEmail } from "../services/emailService.js";

dotenv.config();

const testEmail = async () => {
  try {
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: "NPBC Scheduler Email Test",
      text: "This is a test email from the NPBC Scheduler.",
      html: `
        <h2>NPBC Scheduler</h2>
        <p>This is a test email from the NPBC Scheduler.</p>
        <p>If you received this message, email configuration is working correctly.</p>
      `,
    });

    console.log("Test email sent successfully.");
    process.exit(0);
  } catch (error) {
    console.error("TEST EMAIL FAILED:", error);
    process.exit(1);
  }
};

testEmail();