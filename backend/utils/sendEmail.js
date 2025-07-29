import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Bornify 🔔" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🔐 Your One-Time Password (OTP) for Bornify",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to Bornify 🎉</h2>
          <p style="font-size: 16px; color: #333;">
            Hello 👋, 
          </p>
          <p style="font-size: 16px; color: #333;">
            Here is your <strong>One-Time Password (OTP)</strong> to continue securely:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px; background-color: #f3f4f6; padding: 12px 24px; border-radius: 8px; color: #111827;">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 14px; color: #666;">
            This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 13px; color: #999;">
            If you did not request this, you can safely ignore this email.
          </p>
          <p style="font-size: 13px; color: #999;">
            — The Bornify Team 🎂
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
