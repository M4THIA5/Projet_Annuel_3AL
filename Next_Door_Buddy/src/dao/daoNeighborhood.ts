import { API } from "#/lib/fetch"

export const createNeighborhood = async (data: any) => {
    try {
        const response = await API.post('/neighborhoods', data)
        return response
    } catch (error) {
        console.error("Erreur lors de la création du quartier:", error)
        throw error
    }
}

export const getAllNeighborhoods = async () => {
    try {
        const response = await API.get('/neighborhoods')
        return response
    } catch (error) {
        console.error("Erreur lors de la récupération des quartiers:", error)
        throw error
    }
}

export const getNeighborhood = async (id: string) => {
    try {
        const response = await API.get(`/neighborhoods/${id}`)
        return response
    } catch (error) {
        console.error(`Erreur lors de la récupération du quartier avec l'id ${id}:`, error)
        throw error
    }
}

export const updateNeighborhood = async (id: string, data: any) => {
    try {
        const response = await API.put(`/neighborhoods/${id}`, data)
        return response
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du quartier avec l'id ${id}:`, error)
        throw error
    }
}

export const deleteNeighborhood = async (id: string) => {
    try {
        const response = await API.delete(`/neighborhoods/${id}`)
        return response
    } catch (error) {
        console.error(`Erreur lors de la suppression du quartier avec l'id ${id}:`, error)
        throw error
    }
}
