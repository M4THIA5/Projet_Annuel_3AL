import React, { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

type MapNeighborhoodProps = {
    latitude: number
    longitude: number
    districtName: string
}

const MapNeighborhood: React.FC<MapNeighborhoodProps> = ({ latitude, longitude, districtName }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const map = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        if (!map.current && mapContainer.current && latitude && longitude) {
            mapboxgl.accessToken = process.env.MAPBOX_API_KEY || 'pk.eyJ1Ijoid2F5a29lIiwiYSI6ImNtYmUwbnR2ajIxZzgybnM2cTdudDYwaGgifQ.caKqkcYVeiWLtpuf3VLoVA'
            console.log("test", process.env.API_KEY)

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 14, // zoom adapté à un quartier
            })

            // Ajouter un marker sur le quartier
            new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(districtName)) // Popup avec le nom du district
                .addTo(map.current)
        }

        // Cleanup au démontage du composant
        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [latitude, longitude, districtName])

    return (
        <div className="w-full h-full">
            <h3>Quartier : {districtName}</h3>
            <div
                ref={mapContainer}
                className="w-full h-full"
            />
        </div>
    )
}

export default MapNeighborhood
