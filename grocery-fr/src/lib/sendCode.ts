import nodemailer from "nodemailer";

const sendEmail = async (subject: string, receiver: string, html: any) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    transport.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: receiver,
      html: html,
    });
    return { success: true };
  } catch (error) {
    console.log(error, "error");
  }
};
export default sendEmail;
