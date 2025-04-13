'use client';
import Link from "next/link";

;

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle
} from "#/components/ui/navigation-menu";
import Icon from '@mdi/react';
import {mdiBellOutline, mdiCog} from '@mdi/js';
import {AvatarUser} from "#/components/ui/AvaterUser";
import {getPotentialUser} from "#/lib/dal";
import {useEffect, useState} from "react";

export const AuthLinks = ({user}: { user: any }) => {

    const [userData, setUserData] = useState<any>(null);

    useEffect( () => {
        const fetchData = async () => {
            const fetchedData = await getPotentialUser();
            console.log("fetchedData", fetchedData);
            setUserData(fetchedData);
        };
        fetchData();

    }, []);


    function getInitials(): string {
        if (!userData) return '';
        const initials = userData.user.nom
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('');

        return initials.slice(0, 2);
    }


    if (user) {
        return (
            <>
                <NavigationMenu className={"pr-6"}>
                    <NavigationMenuItem className={"flex align-middle"}>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Accueil
                            </NavigationMenuLink>
                        </Link>
                        &nbsp;
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Mes quartier
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
                                <AvatarUser
                                    src=""
                                    alt="@ton-utilisateur"
                                    fallback={getInitials()}
                                />
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenu>
            </>
        );
    } else {
        return null;
    }
};
