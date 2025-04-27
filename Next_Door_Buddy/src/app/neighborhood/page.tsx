"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Neighborhood } from "#/types/neighborghood"
import { getAllNeighborhoods } from "#/lib/api_requests/neighborhood"

export default function NeighborhoodsPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[] | undefined>(undefined)

  useEffect(() => {
    async function fetchProfile() {
      const data = await getAllNeighborhoods()
      setNeighborhoods(data)
    }
    fetchProfile()
  }, [])

  if (!neighborhoods) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quartiers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span>Aucun quartiers trouvé...</span>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quartiers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {neighborhoods?.map((neighborhood: Neighborhood) => (
          <div key={neighborhood.id}>
            <span>Nom : {neighborhood.name}</span>
            <span>Ville : {neighborhood.city}</span>
            <span>Code Postal : {neighborhood.postalCode}</span>
            <span>Membres : {neighborhood.members}</span>
            <span>Description : {neighborhood.description}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
