import {API} from '#/lib/api_requests/fetchRequest'
import {getAccessToken} from '../authentification'
import {MapboxNeighborhood} from "#/types/mapbox"

export const getMapBoxNeighborhood = async (address: string): Promise<MapboxNeighborhood> => {
    try {
        const response = await API.get(`/geocode/getNeighborhood?address=${encodeURIComponent(address)}`, { accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get neighborhoods')
        }
        return await response.json()
    }
    catch (error) {
        throw error
    }
}
