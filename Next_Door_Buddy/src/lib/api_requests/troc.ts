import {API} from "#/lib/api_requests/fetchRequest"
import {getAccessToken} from "#/lib/authentification"
import {DemandeTroc, Objet} from "#/types/troc"
import {redirect} from "next/navigation";

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

        const response = await API.get('/objets/' + id, {
            accessToken: await getAccessToken(),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Erreur HTTP:', response.status, errorText)
            throw new Error(`Failed to get object (status: ${response.status})`)
        }

        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }

        return data as Objet
    } catch (error) {
        console.error('Erreur dans getObjet:', error)
        throw error
    }
}
export const getMyItems = async (): Promise<Objet[]> => {
    try {
        const response = await API.get('/objets/me', {accessToken: await getAccessToken()})
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


export const createObjet = async (formdata: FormData): Promise<Objet[]> => {
    try {
        const response = await API.postF('/objets/', formdata, {accessToken: await getAccessToken()})
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

export const deleteObjet = async (id: number): Promise<void> => {
    try {
        const response = await API.delete('/objets/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
    } catch (error) {
        throw error
    }
}

export const getDemandesTroc = async (): Promise<DemandeTroc[]> => {
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

export const createDemandeTroc = async (form: FormData): Promise<void> => {
    try {
        const formDataJson: Record<string, any> = {}
        form.forEach((value, key) => {
            formDataJson[key] = value
        })

        const response = await API.post('/troc/', {accessToken: await getAccessToken(), data: formDataJson})
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

export const modifyObjet = async (id: string, form: FormData): Promise<void> => {
    try {
        const response = await API.put('/objet/' + id, {formData: form, accessToken: await getAccessToken()})
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

export const proposeTroc = async (id: string, form: string[]): Promise<boolean> => {
    try {
        const response = await API.post('/troc/' + id+'/propose', {data: form ,accessToken: await getAccessToken()})
        return response.ok
    } catch (error) {
        throw error
    }
}


export const createAcceptionTroc = async (id:number) => {
    try {
        const response = await API.put('/troc/' + id+"/accept", {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        return true
    } catch (error) {
        throw error
    }
}

export const cancelTroc = async (id: string) => {
    try {
        const response = await API.delete('/troc/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
    } catch (error) {
        throw error
    }
}

export const issetTroc = async (id: string) => {
    try {
        const response = await API.get('/troc/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            return false
        }
        const data = await response.json()
        return !!(data)
    } catch (error) {
        throw error
    }
}
export const getTroc = async (id: string) => {
    try {
        const response = await API.get('/troc/' + id, {accessToken: await getAccessToken()})
        if (!response.ok) {
            if (response.status ===400){
                redirect('/troc')
            }
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
export const getTrocItems = async (id: string) => {
    try {
        const response = await API.get('/troc/' + id + '/items', {accessToken: await getAccessToken()})
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

export const refuseTroc = async (id:string) => {
    try {
        const response = await API.delete('/troc/' + id+"/refuse", {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        return true
    } catch (error) {
        throw error
    }
}

export const finalizeTroc = async (id:string) => {
    try {
        const response = await API.post('/troc/' + id+"/finalize", {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        return true
    } catch (error) {
        throw error
    }
}