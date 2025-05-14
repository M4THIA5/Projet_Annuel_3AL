import {render} from '@react-email/components'
import nodemailer from 'nodemailer'
import {Email} from './email'

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@laporteacote.online',
        pass: 'PWqKMnpN*XF0Z%naO8l7',
    },
})

const emailHtml = await render(<Email url="https://example.com"/>)

const options = {
    from: 'noreply@laporteacote.online',
    to: 'adetrindade@myges.fr',
    subject: 'hello world',
    html: emailHtml,
}

await transporter.sendMail(options)
