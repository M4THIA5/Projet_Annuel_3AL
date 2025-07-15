import { API } from "#/lib/api_requests/fetchRequest"
import { getAccessToken } from "#/lib/authentification"
import {Post} from "#/types/post"

// Récupérer tous les posts
export const getPosts = async (): Promise<object> => {
    try {
        const response = await API.get('/posts', { accessToken: await getAccessToken() })
        if (!response.ok) {
            throw new Error('Failed to fetch posts')
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

// Récupérer un post par son ID
export const getPostById = async (id: string): Promise<object> => {
    try {
        const response = await API.get(`/posts/${id}`, { accessToken: await getAccessToken() })
        if (!response.ok) {
            throw new Error('Failed to fetch post')
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

// Récupérer tous les posts d'un quartier par son neighborhoodId
export const getPostsByNeighborhoodId = async (neighborhoodId: string): Promise<Post[]> => {
    try {
        const response = await API.get(`/post/neighborhood/${neighborhoodId}`, { accessToken: await getAccessToken() })
        console.log(response)
        if (!response.ok) {
            throw new Error('Failed to fetch posts by neighborhood')
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

// Créer un nouveau post
export const createPost = async (content: {
    userId: string
    neighborhoodId: string
    content: string
    type: string
    images: File[]
}): Promise<object> => {
    try {
        console.log(content)
        const formData = new FormData()

        formData.append('userId', content.userId)
        formData.append('neighborhoodId', content.neighborhoodId)
        formData.append('content', content.content)
        formData.append('type', content.type)

        content.images.forEach((image) => {
            formData.append('images', image)
        })

        const response = await API.postF('/post/create', formData, {
            accessToken: await getAccessToken(),
        })

        if (!response.ok) {
            throw new Error('Failed to create post')
        }
        console.log(await response.text())
        return response
    } catch (error) {
        console.error('createPost error:', error)
        throw error
    }
}



// Mettre à jour un post
export const updatePost = async (id: string, content: Record<string, never>): Promise<object> => {
    try {
        const formData = new FormData()
        Object.keys(content).forEach(key => {
            formData.append(key, content[key])
        })

        const response = await API.put(`/post/${id}`,formData, {
            accessToken: await getAccessToken(),
        })

        if (!response.ok) {
            throw new Error('Failed to update post')
        }

        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }

        return data
    } catch (error) {
        console.error('Error updating post:', error)
        throw error
    }
}


// Supprimer un post
export const deletePost = async (id: string): Promise<void> => {
    try {
        const response = await API.delete(`/post/${id}`, { accessToken: await getAccessToken() })
        if (!response.ok) {
            throw new Error('Failed to delete post')
        }
    } catch (error) {
        throw error
    }
}
