import {API_URL} from "../config"

class Api {
  private baseUrl: string

  constructor(baseUrl: string) {
      this.baseUrl = baseUrl
  }

  // Méthode pour effectuer une requête GET
  async get(endpoint: string, options?: { accessToken?: string }): Promise<Response> {
    const accessToken = options?.accessToken
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error('Erreur lors de la requête GET:', error)
      throw error
    }
  }

  // Méthode pour effectuer une requête POST
  async post(endpoint: string, options?: { accessToken?: string, data?: unknown }): Promise<Response> {
    const accessToken = options?.accessToken
    const data = options?.data
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Erreur lors de la requête POST:', error)
      throw error
    }
  }

  async postF(endpoint: string,formData: FormData, options?: { accessToken?: string}): Promise<Response> {
    const accessToken = options?.accessToken
    console.log(formData)
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })
    } catch (error) {
      console.error('Erreur lors de la requête POST:', error)
      throw error
    }
  }

  async putF(endpoint: string, formData: FormData, options?: { accessToken?: string }): Promise<Response> {
    const accessToken = options?.accessToken
    console.log(formData)
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // Ne pas mettre Content-Type ici, FormData le gère automatiquement
        },
        body: formData,
      })
    } catch (error) {
      console.error('Erreur lors de la requête PUT:', error)
      throw error
    }
  }


  // Méthode pour effectuer une requête PUT
  async put(endpoint: string, formData: FormData, options?: {
      accessToken?: string
      data?: unknown
  }): Promise<Response> {
    const accessToken = options?.accessToken
    const data = options?.data
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })
    } catch (error) {
      console.error('Erreur lors de la requête PUT:', error)
      throw error
    }
  }

  // Méthode pour effectuer une requête DELETE
  async delete(endpoint: string, options?: { accessToken?: string }): Promise<Response> {
    const accessToken = options?.accessToken
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error('Erreur lors de la requête DELETE:', error)
      throw error
    }
  }
}

export const API = new Api(`${API_URL}`)
