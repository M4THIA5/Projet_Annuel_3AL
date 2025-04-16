import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {decrypt, logout} from "#/lib/session"
import {cookies} from "next/headers"

async function handleSpecialPaths(path: string, req: NextRequest) {
    switch (path) {
        case'/':
            console.log("Home page !")
            break
        case '/login':
            console.log("Login")
            break
        case '/see':
            console.log("Here's the data")
            break

        case '/logout':
            await logout()
            return NextResponse.redirect(new URL('/login', req.nextUrl), )
        default:
            console.log('idk man')
    }
    return undefined
}

const publicRoutes = ['/login', '/signup']
const protectedRoutes = ['/neighborhood']

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)
    const isProtectedRoute = protectedRoutes.includes(path)
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    if (isPublicRoute && session?.userId){
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    if(isProtectedRoute && !session){
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
    const potentialResponse = handleSpecialPaths(path, request)
    if (potentialResponse !== undefined) {
        return potentialResponse
    }
    return NextResponse.next()
}
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        {
            source:
                '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|socket.io).*)',
        },
    ],
}
