import nodemailer from 'nodemailer'
import EventEmitter from 'node:events'

export const sendEmail = async (
    {
        to,
        subject,
        content
    }
) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const info = await transporter.sendMail({
        from: 'kareemjaeger@gmail.com',
        to,
        subject,
        html:content
    })

    console.log('Email sent successfully:', info);
}


export const emitter = new EventEmitter();

emitter.on('sendEmail', (args) => {
    sendEmail(args)
})