import React from "react";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {getPotentialUser} from "#/lib/dal";
import {ThemeProvider} from "next-themes";
import ThemeChooser from "#/components/ThemeChooser";


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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
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
                                    href={"/profile/" + user.userId + "/results"}
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
                            <>
                                <Link className=" text-blue-600 visited:text-purple-600" href="/login">
                                    Connect
                                </Link>

                            <Link className="text-blue-600 visited:text-purple-600" href="/register">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
        {children}
        <footer className="bg-gray-100 py-4">
            <div className="w-full"><p className="m-0 text-center text-black-600 ">Copyright © Your Website 2023</p>
            </div>
        </footer>
                                <Link className="text-blue-600 visited:text-purple-600" href="/register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
                {children}
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
