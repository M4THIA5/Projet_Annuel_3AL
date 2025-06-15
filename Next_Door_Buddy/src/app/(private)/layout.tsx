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
import {UserProfile, userRole} from "#/types/user"
import {getProfile} from "#/lib/api_requests/user"
import {useEffect, useState} from "react"
import { Routes } from "#/Routes"

export default function PrivateLayout({children}: { children: React.ReactNode }) {

    const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfile()
            setProfile(data)
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
                    <Link className="text-3xl ml-5" href={Routes.home.toString()} passHref>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Image width={60} height={60} className="mr-2" src={logo} alt="logo"/>
                            La Porte à côté
                        </div>
                    </Link>
                    <div className="flex">
                        <NavigationMenu className={"pr-6"}>
                            <NavigationMenuItem className={"flex align-middle"}>
                                {profile && profile.roles.includes(userRole.admin) && (
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={Routes.admin.dashboard.toString()}>Dashboard</Link>
                                    </NavigationMenuLink>
                                )}
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={Routes.neighborhood.toString()}>Mes quartiers</Link>
                                </NavigationMenuLink>
                                &nbsp;
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={Routes.chat.toString()}>Discussion</Link>
                                </NavigationMenuLink>
                                &nbsp;
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={Routes.undefined.toString()}>Mes échanges</Link>
                                </NavigationMenuLink>
                                &nbsp;
                                {/* Notification */}
                                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} p-1`}>
                                    <Link href={Routes.undefined.toString()}>
                                        <Icon path={mdiBellOutline} size={1}/>
                                    </Link>
                                </NavigationMenuLink>
                                &nbsp;
                                {/* Settings */}
                                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} p-1`}>
                                    <Link href={Routes.undefined.toString()}>
                                        <Icon path={mdiCog} size={1} />
                                    </Link>
                                </NavigationMenuLink>
                                &nbsp;
                                {/* Profile */}
                                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} p-1 group relative`}>
                                    <Link href={Routes.profile.toString()}>
                                        <Avatar>
                                            <AvatarImage src={profile?.image} alt={profile?.firstName} />
                                            <AvatarFallback>{getInitials()}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenu>
                    </div>
                </div>
            </nav>
            <div className="h-auto px-4 md:px-8 lg:px-16">
                {children}
            </div>
        </>
    )
}
