import { API_URL } from "../config"
import { z } from "zod"

export const loginFormData = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

type LoginFormData = z.infer<typeof loginFormData>

export const loginUser = async (loginData: LoginFormData): Promise<Response> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })
  return response
}
