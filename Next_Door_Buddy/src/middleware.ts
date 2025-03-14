import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {decrypt, logout} from "#/lib/session";
import {cookies} from "next/headers";

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

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    if (isPublicRoute && session?.userId){
            return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    const potentialResponse = handleSpecialPaths(path, request)
    if (potentialResponse !== undefined) {
        return potentialResponse
    }
    return NextResponse.next()
}

function d(request:NextRequest) {
    let cookie = request.cookies.get('nextjs')
    console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
    const allCookies = request.cookies.getAll()
    console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

    request.cookies.has('nextjs') // => true
    request.cookies.delete('nextjs')
    request.cookies.has('nextjs') // => false

    // Setting cookies on the response using the `ResponseCookies` API
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-hello-from-middleware1', 'hello')

    // You can also set request headers in NextResponse.next
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders,
        },
    })
    response.cookies.set('vercel', 'fast')
    response.cookies.set({
        name: 'vercel',
        value: 'fast',
        path: '/',
    })
    cookie = response.cookies.get('vercel')
    console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
    // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.

    // Set a new response header `x-hello-from-middleware2`
    response.headers.set('x-hello-from-middleware2', 'hello')
    return response
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
                '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
        },
    ],
}
