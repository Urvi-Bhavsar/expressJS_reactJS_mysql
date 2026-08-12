const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;
let emailEnabled = false;

try {
  // Check if email credentials are configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify the connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("⚠️  Email service configuration error:");
        console.error("   Message:", error.message);
        console.error("\n📧 Email notifications are DISABLED");
        console.error("   Application will continue without email functionality\n");
        emailEnabled = false;
      } else {
        console.log("✅ Email service is ready");
        emailEnabled = true;
      }
    });
  } else {
    console.warn("⚠️  Email credentials not configured in .env");
    console.warn("   Email notifications are DISABLED\n");
    emailEnabled = false;
  }
} catch (error) {
  console.error("⚠️  Failed to initialize email service:", error.message);
  console.error("   Email notifications are DISABLED\n");
  emailEnabled = false;
}

// Safe email sender wrapper
const sendEmail = async (mailOptions) => {
  if (!emailEnabled || !transporter) {
    console.log("ℹ️  Email skipped (service not available)");
    return { success: false, message: "Email service not available" };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("⚠️  Failed to send email:", error.message);
    // Don't throw - just log and continue
    return { success: false, error: error.message };
  }
};

module.exports = { transporter, sendEmail, isEmailEnabled: () => emailEnabled };
