import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"
import {render} from '@react-email/components'
import nodemailer from 'nodemailer'
import {Email} from '#/emails/email'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Next Door Buddy",
  description: "A social media platform for neighbors",
}
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await transporter.sendMail(options)
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
      </body>
    </html>
  )
}
