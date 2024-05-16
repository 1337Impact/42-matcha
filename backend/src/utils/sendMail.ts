import { Resend } from "resend";
import nodemailer from "nodemailer";

interface SendEmailProps {
  name: string;
  email: string;
  link: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "74d2d2002@smtp-brevo.com",
    pass: "DbGF6yKpjrTQfNwv",
  },
});

async function sendVerificationEmail(data: SendEmailProps) {
  console.log("sending verification mail: ", data);
  try{
    const info = await transporter.sendMail({
      from: '"Matcha 👻" <74d2d2002@smtp-brevo.com>',
      to: data.email,
      subject: "Matcha - Account verification",
      html: `<div>
      <h4>Hi ${data.name}!</h4>\
      <p>Thank you for signing up with Matcha. Please verify your account by clicking the link below.</p>\
      <a href=${data.link}>Click here to verfiy your account.</a>\
      </div>`,
    });
    
    console.log("Message sent: %s", info);
    return { data: "Email sent successfully", error: null };
  }
  catch(error){
    console.error("Error sending email: ", error);
    return { data: null, error: "Error sending email" };
  }
}

export default sendVerificationEmail;
