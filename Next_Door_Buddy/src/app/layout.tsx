import React from "react";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {getPotentialUser} from "#/lib/dal";
import {SocketProvider} from "#/components/SocketProvider";
import {ThemeProvider} from "next-themes";
import ThemeChooser from "#/components/ThemeChooser";
import Image from 'next/image';
import logo from "../assets/logo.png";
import {Navbar} from "#/components/NavBar/NavBar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getPotentialUser();
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>Next Door Buddy</title>
            <link rel="icon" href="/favicon.ico"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Navbar user={user}></Navbar>
            <SocketProvider>
                {children}
            </SocketProvider>
            <ThemeChooser/>
            <footer className="bg-gray-100 py-4">
                <div className="w-full"><p className="m-0 text-center text-black-600 ">Copyright © Your Website 2023</p>
                </div>
            </footer>
        </ThemeProvider>
        </body>
        </html>
    );
}
