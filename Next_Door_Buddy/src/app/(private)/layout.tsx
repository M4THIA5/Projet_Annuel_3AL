"use client"
import Image from "next/image"
import Link from "next/link"
import logo from "@/logo.png"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle
} from "#/components/ui/navigation-menu"
import Icon from '@mdi/react'
import {mdiBellOutline, mdiCog} from '@mdi/js'
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar"
import {UserProfile} from "#/types/user"
import {getprofile} from "#/lib/api_requests/user"
import {useEffect, useState} from "react"

export default function PrivateLayout({children}: { children: React.ReactNode }) {

    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

    useEffect(() => {
        async function fetchProfile() {
            const data = await getprofile()
            setProfile(data)
            console.log(profile)
        }
        fetchProfile()
    }, [])

    function getInitials(): string {
        if (!profile?.firstName) return ''

        const initials = profile.firstName
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('')

        return initials.slice(0, 2)
    }


    return (<>
            <nav className="--background">
                <div className="py-4 flex justify-between">
                    <Link className="text-3xl ml-5" href="/">
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Image width={60} height={60} className="mr-2" src={logo} alt="logo"/>
                            La Porte à côté
                        </div>
                    </Link>
                    <div className="flex ">
                        <NavigationMenu className={"pr-6"}>
                            <NavigationMenuItem className={"flex align-middle"}>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Accueil
                                    </NavigationMenuLink>
                                </Link>
                                &nbsp;
                                <Link href="/neighborhood" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Mes quartiers
                                    </NavigationMenuLink>
                                </Link>
                                &nbsp;
                                <Link href="/chat" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Discussion
                                    </NavigationMenuLink>
                                </Link>
                                &nbsp;
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Mes échanges
                                    </NavigationMenuLink>
                                </Link>
                                &nbsp;
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} p-1`}>
                                        <Icon path={mdiBellOutline} size={1}/>
                                    </NavigationMenuLink>
                                </Link>
                                &nbsp;
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} p-1`}>
                                        <Icon path={mdiCog} size={1} />
                                    </NavigationMenuLink>
                                </Link>
                                &nbsp;
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} p-1`}>
                                        <Avatar>
                                            <AvatarImage src={profile?.image} alt={profile?.firstName} />
                                            <AvatarFallback>{getInitials()}</AvatarFallback>
                                        </Avatar>
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenu>
                    </div>
                </div>
            </nav>
            <div >
                {children}
            </div>
        </>
    )
}
