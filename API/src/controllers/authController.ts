import { PrismaClient as PostgresClient } from '../../prisma/client/postgresClient'
import { RequestHandler, Request, Response, NextFunction } from "express"
import { config } from '../config/env'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import type { CurrentUser } from '../types'
import { accessTokenExpiration, refreshTokenExpiration, refreshTokenName, accessTokenName, UserRole, userRole } from '../config/utils'

const postgresClient = new PostgresClient()
class AuthController {
  login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
      const user = await postgresClient.user.findUnique({ where: { email } })
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      if (await argon2.verify(user.password, password)) {
        const accessToken = jwt.sign(
          { id: user.id, email: user.email, roles: user.roles as UserRole[] },
          config.ACCESS_TOKEN_SECRET,
          { expiresIn: accessTokenExpiration }
        )
        const refreshToken =  jwt.sign(
          { id: user.id, email: user.email, roles: user.roles as UserRole[] },
          config.REFRESH_TOKEN_SECRET,
          { expiresIn: refreshTokenExpiration }
        )

        postgresClient.user.update({
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

  register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body
    try {
      const hashedPassword = await argon2.hash(password)
      const user = await postgresClient.user.findUnique({ where: { email } })
      if (user) {
        res.status(409).json({ error: 'User already exists' })
        return
      }
      await postgresClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          roles: [userRole.classic]
        }
      })
      res.status(201).json({ message: 'User registered successfully' })
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

      postgresClient.user.update({
        where: { id: currentUser.id },
        data: { refreshToken: undefined }
      })

      res.cookie(refreshTokenName, '', { maxAge: 0 })
      res.clearCookie(refreshTokenName, { httpOnly: true, sameSite: 'lax', secure: true })

      res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
      next(error)
    }
  }

  handleRefreshToken: RequestHandler = async (req: Request, res: Response) => {
    try {
      const token = req.body.refreshToken || req.cookies[refreshTokenName]
      if (!token) {
        console.log('mathias 0')
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const payload = jwt.verify(token, config.REFRESH_TOKEN_SECRET) as CurrentUser
      const user = await postgresClient.user.findUnique({ where: { id: Number(payload.id) } })
      if (!user) {
        console.log('mathias 1')
        res.status(404).json({ error: 'User not found' })
        return
      }

      const tokenExpiration = (jwt.decode(token) as any).exp * 1000
      const currentTime = Date.now()
      if (tokenExpiration < currentTime) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, roles: user.roles as UserRole[] },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: accessTokenExpiration }
      )
      res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 10 * 60 * 1000 // 10 minutes
      })
      res.status(200).json({ accessToken })
    } catch (_) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

export default AuthController