import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});


const sendotp = async (email, otp) => {
  const info = await transporter.sendMail({
    from: `"CloudVault" <${process.env.NODE_MAILER_USER}>`,
    to: email,
    subject: "One Time Password (OTP) for your LOGIN on CloudVault",
    text: `your OTP for is ${otp}`,

  });

  console.log("Message sent:", info.messageId);
}

export const sendShareEmail = async (fromName, toEmail, filename, permission) => {
  try {
    const info = await transporter.sendMail({
      from: `"CloudVault" <${process.env.NODE_MAILER_USER}>`,
      to: toEmail,
      subject: `[CloudVault] ${fromName} shared a file with you`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0dfdf; border-radius: 16px; background-color: #fafafa; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <h2 style="color: #1a1c1a; font-weight: 800; margin-top: 0;">CloudVault Link Shared</h2>
          <p style="color: #4a4d4a; font-size: 14px; line-height: 1.6;">
            <strong>${fromName}</strong> has shared a file with you on CloudVault.
          </p>
          <div style="background-color: #ffffff; border: 1px solid #e0dfdf; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #1a1c1a; font-weight: bold;">File Name:</p>
            <p style="margin: 4px 0 12px 0; font-size: 14px; color: #2c3e50;">${filename}</p>
            <p style="margin: 0; font-size: 14px; color: #1a1c1a; font-weight: bold;">Permission:</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #7f8c8d;">${permission === "edit" ? "Can Edit (Editor)" : "Can View (Viewer)"}</p>
          </div>
          <p style="color: #7f8c8d; font-size: 12px; line-height: 1.5; margin-bottom: 25px;">
            Log in to your CloudVault dashboard and visit the <strong>Shared</strong> tab to access and manage this file.
          </p>
          <div style="text-align: center;">
            <a href="${process.env.ORIGIN || 'http://localhost:5174'}" style="background-color: #4a4d4a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">Open CloudVault</a>
          </div>
        </div>
      `
    });
    console.log("Share email sent:", info.messageId);
  } catch (err) {
    console.error("Nodemailer sendShareEmail error:", err);
  }
};

export default sendotp;