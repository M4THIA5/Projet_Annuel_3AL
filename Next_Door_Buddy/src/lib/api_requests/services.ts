import {API} from "#/lib/api_requests/fetchRequest"
import {getAccessToken} from "#/lib/authentification"
import {Service} from "#/types/service"


export const getAllServices = async (): Promise<Service[]> => {
    try {
        const response = await API.get('/services', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get services')
        }
        const data = await response.json() as Service[]
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}
export const getAvailableServices = async (): Promise<Service[]> => {
    try {
        const response = await API.get('/services/available', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get services')
        }
        const data = await response.json() as Service[]
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}


export const fetchUserServices = async (): Promise<Service[]> => {
    try {
        const response = await API.get('/services/me', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get services')
        }
        const data = await response.json() as Service[]
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}




export const getServiceById = async (id: number): Promise<Service> => {
    try {
        const response = await API.get('/services/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get service')
        }
        const data = await response.json() as Service
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}

export const createService = async (service: Service): Promise<void> => {
    try {
        const response = await API.post('/services/', {accessToken: await getAccessToken(), data: service})
        if (!response.ok) {
            throw new Error('Failed to get service')
        }
    } catch (error) {
        throw error
    }
}

export const acceptRequest = async (id: string): Promise<void> => {
    try {
        const response = await API.get('/services/'+id+"/accept", {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get service')
        }
    } catch (error) {
        throw error
    }
}

export const deleteRequest = async (id: string): Promise<void> => {
    try {
        const response = await API.delete('/services/'+id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get service')
        }
    } catch (error) {
        throw error
    }
}
