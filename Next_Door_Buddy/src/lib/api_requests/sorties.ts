import {Sortie} from "#/types/sortie"
import {API} from "#/lib/api_requests/fetchRequest"
import {getAccessToken} from "#/lib/authentification"

export const getNextSorties = async (): Promise<Sortie[]> => {
    try {
        const response = await API.get('/sorties/future', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get sorties')
        }
        const data = await response.json() as Sortie[]
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}

export const getAllSorties = async (): Promise<Sortie[]> => {
    try {
        const response = await API.get('/sorties', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get sorties')
        }
        const data = await response.json() as Sortie[]
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}
export const acceptRequest = async (id: string): Promise<void> => {
    try {
        const response = await API.get('/sorties/'+id+"/accept", {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get sortie')
        }
    } catch (error) {
        throw error
    }
}

export const createSortie = async (sortie: Sortie): Promise<void> => {
    try {
        const response = await API.post('/sorties', {accessToken: await getAccessToken(), data: sortie})
        if (!response.ok) {
            throw new Error('Failed to get sortie')
        }
    } catch (error) {
        throw error
    }
}

export const deleteRequest = async (id: string): Promise<void> => {
    try {
        const response = await API.delete('/sorties/'+id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get sortie')
        }
    } catch (error) {
        throw error
    }
}

export const getSortieById = async (id: number): Promise<Sortie> => {
    try {
        const response = await API.get('/sorties/' + id.toString(), {accessToken: await getAccessToken()})
        console.log(response.status)
        if (!response.ok) {
            throw new Error('Failed to get sortie')
        }
        const data = await response.json() as Sortie
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}
