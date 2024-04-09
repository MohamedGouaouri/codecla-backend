import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendVerificationMail(to, url) {
    try{
        const info = await transporter.sendMail({
            from: '"CodeCLA" <mohamedgouari2000@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "Welcome to CodeCLA ✔", // Subject line
            html: `<p>Please follow this link to confirm your email <a href=${url}></a>here</p>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
    } catch (e) {
        console.error('Could not send email')
    }
}