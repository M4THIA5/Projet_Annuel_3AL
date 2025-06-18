import type {Metadata} from "next"
import { ToastContainer } from 'react-toastify'
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"
import 'react-toastify/dist/ReactToastify.css'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  )
}
