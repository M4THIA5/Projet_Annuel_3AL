import { z } from "zod"
import { API } from "#/lib/api_requests/fetchRequest"
import { deleteTokens } from "../authentification"

export const loginFormData = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

type LoginFormData = z.infer<typeof loginFormData>

export const loginUser = async (loginData: LoginFormData): Promise<{ accessToken: string, optVerified?: boolean }> => {
  try {
    const response = await API.post('/login', { data: loginData })
    const data = await response.json()
    if (response.status === 403) {
      // if the opt verification fails, return false
      return { accessToken: '', optVerified: false }
    }
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
      await deleteTokens()
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

export const refreshToken = async (refreshToken: string | undefined): Promise<{ accessToken?: string }> => {
  try {
    const response = await API.post('/refresh-access-token', { data: { refreshToken } })
    const data = await response.json()
    return data
  } catch (error) {
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

export const checkResetPasswordCode = async (email: string, code: string): Promise<boolean> => {
  try {
    const response = await API.post('/check-reset-password-code', { data: { email, resetPasswordCode: code } })
    if (!response.ok) {
      return false
    }
    const { isValid } = await response.json()
    return isValid
  } catch (error) {
    console.error('Error checking reset password code:', error)
    throw error
  }
}

export const resetPassWord = async (email: string, newPassword: string): Promise<Response> => {
  try {
    const response = await API.put('/reset-password', { data: { email, newPassword } })
    return response
  } catch (error) {
    console.error('Error during password reset:', error)
    throw error
  }
}
