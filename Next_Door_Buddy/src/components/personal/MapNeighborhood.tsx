import React, { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { NEXT_PUBLIC_MAPBOX_API_KEY } from '#/lib/config'
import { MapNeighborhoodProps } from '#/types/mapbox'

// Import de Turf convex et helpers
import convex from '@turf/convex'
import { featureCollection, point } from '@turf/helpers'

const MapNeighborhood: React.FC<MapNeighborhoodProps> = ({ users }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const map = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        if (!mapContainer.current || users.length === 0) return

        const validUsers = users.filter(u => u.user.latitude != null && u.user.longitude != null)
        if (validUsers.length === 0) return

        mapboxgl.accessToken = NEXT_PUBLIC_MAPBOX_API_KEY || ''

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [validUsers[0].user.longitude, validUsers[0].user.latitude],
                zoom: 13,
            })
        }

        validUsers.forEach(({ user }) => {
            new mapboxgl.Marker()
                .setLngLat([user.longitude!, user.latitude!])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setText(
                        `${user.firstName} ${user.lastName}`.trim()
                    )
                )
                .addTo(map.current!)
        })

        if (validUsers.length >= 3) {
            // Construire un FeatureCollection de points turf
            const points = featureCollection(
                validUsers.map(({ user }) => point([user.longitude!, user.latitude!]))
            )

            // Calculer l'enveloppe convexe
            const hull = convex(points)

            if (!hull) return // pas assez de points ou erreur

            // Zoomer sur le polygone
            const coordinates = hull.geometry.coordinates[0]
            const bounds = coordinates.reduce(
                (bounds, coord) => bounds.extend(coord as [number, number]),
                new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
            )

            map.current?.fitBounds(bounds, {
                padding: 50,
                maxZoom: 15,
                duration: 1000,
            })

            map.current?.on('load', () => {
                if (!map.current) return

                if (map.current?.getSource('hull')) {
                    (map.current.getSource('hull') as mapboxgl.GeoJSONSource).setData(hull)
                } else {
                    map.current?.addSource('hull', {
                        type: 'geojson',
                        data: hull,
                    })

                    map.current?.addLayer({
                        id: 'hull-fill',
                        type: 'fill',
                        source: 'hull',
                        layout: {},
                        paint: {
                            'fill-color': '#088',
                            'fill-opacity': 0.2,
                        },
                    })

                    map.current?.addLayer({
                        id: 'hull-line',
                        type: 'line',
                        source: 'hull',
                        layout: {},
                        paint: {
                            'line-color': '#088',
                            'line-width': 2,
                        },
                    })
                }
            })
        }

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [users])

    return (
        <div className="w-full h-full">
            <div ref={mapContainer} className="w-full h-[500px]" />
        </div>
    )
}

export default MapNeighborhood
