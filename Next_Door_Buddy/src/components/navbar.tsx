import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "#/components/ui/navigation-menu"
import { Routes } from "#/Routes"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={Routes.home.toString()} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Image
                src="/logo.png"
                alt="Next Door Buddy"
                width={100}
                height={100}
                className="h-10 w-10 rounded-full"
              />
              <span className="ml-2 text-lg font-bold">Next Door Buddy</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
