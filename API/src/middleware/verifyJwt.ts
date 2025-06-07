
import { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { UserRole } from '../config/utils'
import {PrismaClient as PostgresClient} from '../../prisma/client/postgresClient'

const postgresClient = new PostgresClient()

export async function verifyJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  const refreshCookie = req.cookies?.refreshToken

  if (!token || !refreshCookie) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  
  try {
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, async (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' })
      }
    if (!decoded || !decoded.id || !decoded.email || !decoded.roles) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const user = await postgresClient.user.findUnique({
      where: { id: decoded.id },
      select: { refreshToken: true }
    })
    if (refreshCookie !==  user?.refreshToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    (req as any).user = { id: decoded.id, email: decoded.email, roles: decoded.roles as UserRole[] }
    next()
  })
  } catch (error) {
    next(error)
  }
}

export async function verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!(req as any).user.isAdmin) {
    res.status(403).json({ error: 'Forbidden' })
  }

  next()
}
