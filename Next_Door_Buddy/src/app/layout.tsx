"use client";

import React, {useEffect} from "react";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

function textColor(color: string) {
    let r, g, b;
    if (color.length === 6) {
        r = parseInt(color.slice(0, 2), 16);
        g = parseInt(color.slice(2, 4), 16);
        b = parseInt(color.slice(4, 6), 16);
    } else {
        r = parseInt(color.slice(0, 1).repeat(2), 16);
        g = parseInt(color.slice(1, 2).repeat(2), 16);
        b = parseInt(color.slice(2, 3).repeat(2), 16);
    }
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const user = undefined;
    let classe: string;
    let classe2: string;
    let style: object;

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>Next Door Buddy</title>
            <link rel="icon" href="/favicon.ico"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <nav className={"bg-gray-100"}>
            <div className="py-4 flex">
                <Link className="text-3xl ml-5" href="/">
                    La Porte à côté
                </Link>
                <div className="flex justify-around grow items-center" id="navbarSupportedContent">
                    <Link className=" text-blue-600 visited:text-purple-600" href="/">
                        Home
                    </Link>
                    <Link className=" text-blue-600 visited:text-purple-600" href="/create">
                        Create
                    </Link>
                    <Link className=" text-blue-600 visited:text-purple-600" href="/see">
                    See
                </Link>
                    {user ? (
                        <>
                            <Link
                                className=" text-blue-600 visited:text-purple-600"
                                href={"/profile/" + user.id + "/results"}
                            >
                                Results
                            </Link>
                            <Link href={"/profile"} className={" text-blue-600 visited:text-purple-600"}>
                                Profile
                            </Link>
                            <Link href={"/games"} className={" text-blue-600 visited:text-purple-600"}>
                                Games
                            </Link>
                            <Link href={"/logout"} className={" text-blue-600 visited:text-purple-600"}>
                                Logout
                            </Link>
                        </>
                    ) : (
                        <Link className=" text-blue-600 visited:text-purple-600" href="/login">
                            Connect
                        </Link>
                    )}
                </div>
            </div>
        </nav>
        {children}
        <footer className="bg-gray-100 py-4">
            <div className="w-full"><p className="m-0 text-center text-black-600 ">Copyright © Your Website 2023</p>
            </div>
        </footer>
        </body>
        </html>
    );
}
