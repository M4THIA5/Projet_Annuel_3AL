import React from "react"
import {Geist, Geist_Mono} from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import {getPotentialUser} from "#/lib/dal"
import {SocketProvider} from "#/components/SocketProvider"
// import {ThemeProvider} from "next-themes"
import ThemeChooser from "#/components/ThemeChooser"
import {Navbar} from "#/components/NavBar/NavBar"

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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    // const user = await getPotentialUser()
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta charSet="UTF-8"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        > */}
                {/* <Navbar user={user}></Navbar> */}
                {/* <SocketProvider> */}
                    {children}
                {/* </SocketProvider> */}
            <footer className="bottom-0 w-full ">

                <div className="w-full">
                    <div>
                        {/* <ThemeChooser/> */}
                    </div>
                    <p className="p-3 bg-gray-100 text-center text-black-600 "> Copyright © Your Website 2023</p>
                </div>
            </footer>
        {/* </ThemeProvider> */}
        </body>
        </html>
    )
}
