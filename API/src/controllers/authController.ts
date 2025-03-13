import { PrismaClient } from '@prisma/client'
import { RequestHandler, Request, Response, NextFunction } from "express"
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

class AuthController {
  login: RequestHandler = async (req: Request, res: Response, next) => {
    const { email, password } = req.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        res.status(404).json({ error: 'User not found' })
      }

      if (await argon2.verify(user!.password, password)) {
        jwt.sign({ id: user!.id, email: user!.email, isAdmin: user!.isAdmin }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })
        res.status(200).json({ message: 'Login successful' })
      } else {
        res.status(401).json({ error: 'Invalid email or password' })
      }

    } catch (error) {
      next(error)
    }
  }

  logout: RequestHandler = async (req: Request, res: Response, next) => {
    // destroy the token
    res.status(200).json({ message: 'Logout successful' })
  }

}

export default AuthController