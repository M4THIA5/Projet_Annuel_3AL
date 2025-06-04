import Link from "next/link"
import Image from "next/image"
import logo from "@/logo.png"
import { Routes } from "#/Routes"

export default async function AuthLayout({children}: { children: React.ReactNode }) {

    return (<>
            <div className="h-screen">
                <nav className="--background">
                    <div className="py-4 flex justify-between">
                        <Link className="text-3xl ml-5" href={Routes.home.toString()} legacyBehavior passHref>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Image width={60} height={60} className="mr-2" src={logo} alt="logo"/>
                                La Porte à côté
                            </div>
                        </Link>
                    </div>
                </nav>
                <div >
                    {children}
                </div>
            </div>
        </>
    )
}
