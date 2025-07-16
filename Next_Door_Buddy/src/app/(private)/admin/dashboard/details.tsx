import { getNeighborhoodsOfUser } from "#/lib/api_requests/neighborhood"
import { Neighborhood } from "#/types/neighborghood"
import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import Image from "next/image"

export function Details({ userId, setUserDetails }: { userId: number, setUserDetails: (details: number | null) => void }) {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[] | []>([])

  const fetchNeighborhood = useCallback(async () => {
        const data = await getNeighborhoodsOfUser(userId)

        setNeighborhoods(data)
      }, [userId])

  useEffect(() => {
    fetchNeighborhood()
  }, [fetchNeighborhood])

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Détails des Quartiers de l&apos;utilisateur</h2>
        <button onClick={() => setUserDetails(null)} aria-label="Fermer" className="p-2 rounded hover:bg-gray-100 top-2 right-2">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M14 6l-8 8" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {neighborhoods.map((neighborhood) => (
            <Card
            key={neighborhood.id}
            className="transition-shadow duration-200 hover:shadow-xl border-2 border-gray-100 hover:border-primary bg-white rounded-xl overflow-hidden"
            >
            <CardHeader className="p-0 relative">
              {neighborhood.image ? (
              <Image
                src={`data:image/jpeg;base64,${neighborhood.image}`}
                alt={neighborhood.name}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-t-xl"
                style={{ objectFit: "cover" }}
                unoptimized
              />
              ) : (
              <div className="w-full h-40 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center rounded-t-xl">
                <span className="text-gray-400 text-lg">Aucune image</span>
              </div>
              )}
              <CardTitle className="absolute bottom-2 left-4 text-white text-xl font-bold drop-shadow-lg bg-black/40 px-2 py-1 rounded">
              {neighborhood.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 gap-2">
              <span className="bg-gray-100 rounded px-2 py-0.5">ID: {neighborhood.id}</span>
              {neighborhood.city && (
                <span className="bg-gray-100 rounded px-2 py-0.5">Ville: {neighborhood.city}</span>
              )}
              {neighborhood.postalCode && (
                <span className="bg-gray-100 rounded px-2 py-0.5">Code Postal: {neighborhood.postalCode}</span>
              )}
              </div>
              <p className="text-sm text-primary font-semibold mb-1">
              Membres: <span className="font-bold">{neighborhood.members}</span>
              </p>
              <p className="text-xs text-gray-500 mb-1">
              Créé le: <span className="font-medium">{new Date(neighborhood.createdAt).toLocaleDateString()}</span>
              </p>
              {neighborhood.description && (
              <p className="text-sm text-gray-700 mb-2 italic">{neighborhood.description}</p>
              )}
              {neighborhood.updatedAt && (
              <p className="text-xs text-gray-400 text-right">Mis à jour: {new Date(neighborhood.updatedAt).toLocaleDateString()}</p>
              )}
            </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
