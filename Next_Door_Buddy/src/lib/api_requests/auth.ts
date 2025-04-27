import { z } from "zod"
import { API } from "#/lib/api_requests/fetchRequest"

export const loginFormData = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

type LoginFormData = z.infer<typeof loginFormData>

export const loginUser = async (loginData: LoginFormData): Promise<{ accessToken: string }> => {
  try {
    const response = await API.post('/login', { data: loginData })
    if (!response.ok) {
      throw new Error('Failed to login')
    }
    const data = await response.json()
    return data
  }
  catch (error) {
    console.error('Error during login:', error)
    throw error
  }
}

export const logout = async (accessToken: string): Promise<void> => {
  try {
    const response = await API.post('/logout', { accessToken })
    if (!response.ok) {
      throw new Error('Failed to logout')
    }
  } catch (error) {
    console.error('Error during logout:', error)
    throw error
  }
}

export const refreshToken = async (refreshToken: string | undefined): Promise<{ accessToken: string }> => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required')
    }

    const response = await API.post('/refresh-access-token', { data: { refreshToken } })
    const data = await response.json()
    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }
    return data
  } catch (error) {
    console.error('Error during token refresh:', error)
    throw error
  }
}


export const registerFormData = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  confirmPassword: z.string().min(5),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export type RegisterData = Omit<z.infer<typeof registerFormData>, 'confirmPassword'>

export const registerUser = async (registerData: RegisterData): Promise<{ accessToken: string }> => {
  try {
    const response = await API.post('/register', { data: registerData })
    if (!response.ok) {
      throw new Error('Failed to register')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error during registration:', error)
    throw error
  }
}
