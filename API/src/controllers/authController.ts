import { PrismaClient } from '@prisma/client'
import { RequestHandler, Request, Response, NextFunction } from "express"
import { config } from '../config/env'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import type { CurrentUser } from '../types'
import { accessTokenExpiration, refreshTokenExpiration, refreshTokenName, accessTokenName } from '../config/utils'

const prisma = new PrismaClient()
class AuthController {
  login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      if (await argon2.verify(user.password, password)) {
        const accessToken = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          config.ACCESS_TOKEN_SECRET,
          { expiresIn: accessTokenExpiration }
        )
        const refreshToken =  jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          config.REFRESH_TOKEN_SECRET,
          { expiresIn: refreshTokenExpiration }
        )

        prisma.user.update({
          where: { id: user.id },
          data: { refreshToken }
        })

        res.cookie(refreshTokenName, refreshToken, {
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/', 
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })

        res.cookie(accessTokenName, accessToken, {
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 10 * 60 * 1000 // 10 minutes
        })

        res.status(200).json({ accessToken })
      } else {
        res.status(401).json({ error: 'Invalid email or password' })
      }

    } catch (error) {
      next(error)
    }
  }

  logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user as CurrentUser
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      prisma.user.update({
        where: { id: currentUser.id },
        data: { refreshToken: undefined }
      })

      res.cookie(refreshTokenName, '', { maxAge: 0 })
      res.clearCookie(refreshTokenName, { httpOnly: true, sameSite: "none", secure: true })

      res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
      next(error)
    }
  }

  handleRefreshToken: RequestHandler = async (req: Request, res: Response) => {
    try {
      const token = req.cookies[refreshTokenName]
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const payload = jwt.verify(token, config.REFRESH_TOKEN_SECRET) as CurrentUser
      const user = await prisma.user.findUnique({ where: { id: payload.id, email: payload.email } })
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      const tokenExpiration = (jwt.decode(token) as any).exp * 1000
      const currentTime = Date.now()
      if (tokenExpiration > currentTime) {
        res.status(200).json({ message: 'Token is still valid' })
        return
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: accessTokenExpiration }
      )
      res.status(200).json({ accessToken })
    } catch (_) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

export default AuthController