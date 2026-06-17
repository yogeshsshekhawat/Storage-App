import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});


const sendotp = async (email,otp)=>{
  const info = await transporter.sendMail({
    from: `"CloudVault" <${process.env.NODE_MAILER_USER}>`,
    to: email,
    subject: "One Time Password (OTP) for your LOGIN on CloudVault",
    text: `your OTP for is ${otp}`, 
    
  });

  console.log("Message sent:", info.messageId);
}


export default sendotp;