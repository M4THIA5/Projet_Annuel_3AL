import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { ResetPasswordEmail } from "#/emails/email"
import { SMTP } from "#/lib/config"

export async function POST(req: Request) {
  const { email, resetUrl } = await req.json()

  if (!email || !resetUrl) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: Number(SMTP.PORT), 
    secure: false,
    auth: {
      user: SMTP.USER,
      pass: SMTP.PASS,
    },
  })

  const htmlContent = await render(ResetPasswordEmail({ url: resetUrl }))

  try {
    transporter.sendMail({
      from: SMTP.FROM || "noreply@laporteacote.online",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: htmlContent,
      text: `Pour réinitialiser votre mot de passe, cliquez ici : ${resetUrl}`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Erreur email:", err)
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 })
  }
}
