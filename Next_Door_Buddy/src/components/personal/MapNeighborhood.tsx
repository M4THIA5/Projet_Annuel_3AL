import React, { useEffect, useRef, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

type MapNeighborhoodProps = {
    latitude: number
    longitude: number
    districtName: string
}

const MapNeighborhood: React.FC<MapNeighborhoodProps> = ({ latitude, longitude, districtName }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const draw = useRef<MapboxDraw | null>(null)
    const [drawnPolygon, setDrawnPolygon] = useState<any>(null)

    useEffect(() => {
        if (!map.current && mapContainer.current && latitude && longitude) {
            mapboxgl.accessToken = process.env.MAPBOX_API_KEY || 'pk.eyJ1Ijoid2F5a29lIiwiYSI6ImNtYmUwbnR2ajIxZzgybnM2cTdudDYwaGgifQ.caKqkcYVeiWLtpuf3VLoVA'

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 14,
            })
            
            draw.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                },
                defaultMode: 'draw_polygon'
            })
            map.current.addControl(draw.current)
            
            new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(districtName))
                .addTo(map.current)
            
            map.current.on('draw.create', updateArea)
            map.current.on('draw.update', updateArea)
            map.current.on('draw.delete', () => setDrawnPolygon(null))
        }

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [latitude, longitude, districtName])
    
    const updateArea = () => {
        if (!draw.current) return

        const data = draw.current.getAll()
        if (data.features.length > 0) {
            setDrawnPolygon(data.features[0])
            console.log("Zone dessinée:", data.features[0])
        } else {
            setDrawnPolygon(null)
        }
    }

    return (
        <div className="w-full h-full">
            <div ref={mapContainer} className="w-full h-[500px]" />
            {drawnPolygon && (
                <pre className="mt-4 p-2 bg-gray-100 text-sm overflow-auto" style={{maxHeight: '150px'}}>
                    {JSON.stringify(drawnPolygon.geometry.coordinates, null, 2)}
                </pre>
            )}
        </div>
    )
}

export default MapNeighborhood
