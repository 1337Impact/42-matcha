import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface SendEmailProps {
  name: string;
  email: string;
  link: string;
}

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST as string,
  port: parseInt(process.env.EMAIL_PORT as string),
  secure: false,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendVerificationEmail(data: SendEmailProps) {
  try {
    const info = await transporter.sendMail({
      from: `"Matcha 👻" <${process.env.EMAIL_LOGIN}>`,
      to: data.email,
      subject: "Matcha - Account verification",
      html: `<div>
      <h4>Hi ${data.name}!</h4>\
      <p>Thank you for signing up with Matcha. Please verify your account by clicking the link below.</p>\
      <a href=${data.link}>Click here to verfiy your account.</a>\
      </div>`,
    });

    return { data: "Email sent successfully", error: null };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { data: null, error: "Error sending email" };
  }
}

export default sendVerificationEmail;
