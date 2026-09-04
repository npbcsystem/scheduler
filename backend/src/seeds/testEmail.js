import "dotenv/config";

import { sendEmail } from "../services/emailService.js";

const testEmail = async () => {
  try {
    console.log("SMTP CONFIG:");
    console.log("HOST:", process.env.SMTP_HOST);
    console.log("PORT:", process.env.SMTP_PORT);
    console.log("USER:", process.env.SMTP_USER);

    await sendEmail({
      to: process.env.SMTP_USER,
      subject: "NPBC Scheduler Email Test",
      text: "This is a test email from the NPBC Scheduler.",
      html: `
        <h2>NPBC Scheduler</h2>
        <p>This is a test email from the NPBC Scheduler.</p>
        <p>
          If you received this message, the email configuration
          is working correctly.
        </p>
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