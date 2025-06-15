import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  if (!query || Object.keys(query).length === 0) {
    return path
  }
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, value.toString())
  })
  return `${path}?${params.toString()}`
}
