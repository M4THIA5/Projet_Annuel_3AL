import Image from "next/image";
import Link from "next/link";
import logo from "@/logo.png";
import { AuthLinks } from "./AuthLinks.tsx";

export const Navbar = ({ user }: { user: any }) => {
    return (
        <nav className="bg-[var(--color-primary)]">
            <div className="py-4 flex justify-between">
                <Link className="text-3xl ml-5" href="/">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image width={60} height={60} className="mr-2" src={logo} alt="logo" />
                        La Porte à côté
                    </div>
                </Link>
                <div className="flex " >
                    <AuthLinks user={user} />
                </div>
            </div>
        </nav>
    );
};
