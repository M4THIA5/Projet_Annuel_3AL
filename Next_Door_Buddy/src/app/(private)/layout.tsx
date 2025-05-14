import Navbar from "#/components/navbar"
import { SocketProvider } from "./chat/socketProvider"

export default async function PrivateLayout({children}: {children: React.ReactNode}) {

  return (
      <div className={`h-screen flex flex-col items-center justify-center`}>
        <Navbar />
        <SocketProvider>
          {children}
        </SocketProvider>
      </div>
  )
}
