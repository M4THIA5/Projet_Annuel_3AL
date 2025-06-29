

import {API} from "#/lib/api_requests/fetchRequest"
import {getAccessToken} from "#/lib/authentification"
import {DemandeTroc, Objet} from "#/types/troc"

export const getObjets = async (): Promise<Objet[]> => {
    try {
        const response = await API.get('/objets/', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}
export const getObjet = async (id: string): Promise<Objet> => {
    try {
        const response = await API.get('/objets/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}

export const createObjet = async (formdata:FormData): Promise<Objet[]> => {
    try {
        const response = await API.postf('/objets/', {accessToken: await getAccessToken(), data:formdata})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}

export const deleteObjet = async (id: string): Promise<void> => {
    try {
        const response = await API.delete('/objets/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
    } catch (error) {
        throw error
    }
}

export const getDemandesTroc= async (): Promise<DemandeTroc[]> => {
    try {
        const response = await API.get('/troc/', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}

export const createDemandeTroc = async (): Promise<void> => {
    try {
        const response = await API.post('/troc/', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}