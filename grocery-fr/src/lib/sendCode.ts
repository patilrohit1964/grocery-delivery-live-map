import nodemailer from "nodemailer";

const sendEmail = async (subject: string, receiver: string, html:any) => {
    try {
        nodemailer.createTransport({
            service:'gmail'
        })
    } catch (error) {
        console.log(error,'error')
    }
};
