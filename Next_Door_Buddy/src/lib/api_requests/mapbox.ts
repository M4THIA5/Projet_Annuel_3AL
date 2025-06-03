import {API} from '#/lib/api_requests/fetchRequest'
import {getAccessToken} from '../authentification'
import {MapboxAdresse, MapboxNeighborhood} from "#/types/mapbox"

export const getMapBoxNeighborhood = async (address: string): Promise<MapboxNeighborhood> => {
    try {
        const accessToken = await getAccessToken()
        const response = await API.get(
            `/geocode/getNeighborhood?address=${encodeURIComponent(address)}`,
            { accessToken }
        )

        const data = await response.json()

        if (data.status !== 200) {
            throw new Error(`Échec de la récupération du quartier : ${data.status} ${data.error || ""}`)
        }

        return data as MapboxNeighborhood
    } catch (error) {
        console.error("Erreur dans getMapBoxNeighborhood:", error)
        throw error
    }
}

export const getMapBoxAdresse = async (lat: number, lon: number): Promise<MapboxAdresse> => {
    try {
        const accessToken = await getAccessToken()
        const response = await API.get(
            `/geocode/getAdresseMapBox?lat=${lat}&lon=${lon}`,
            { accessToken }
        )

        const data = await response.json()

        if (data.status !== 200) {
            throw new Error(`Échec de la récupération de l'adresse : ${data.status} ${data.error || ""}`)
        }

        return data as MapboxAdresse
    } catch (error) {
        console.error("Erreur dans getMapBoxAdresse:", error)
        throw error
    }
}

