
import { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { UserRole } from '../config/utils'

export async function verifyJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  // const token = req.header('Authorization')?.replace('Bearer ', '')
  // if (!token) {
  //   res.status(401).json({ error: 'Unauthorized' })
  //   return
  // }
  //
  // try {
  //   jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
  //     if (err) {
  //       return res.status(403).json({ error: 'Forbidden' })
  //     }
  //
  //   (req as any).user = { id: decoded.id, email: decoded.email, roles: decoded.roles as UserRole[] }
  //   next()
  // })
  // } catch (error) {
  //   next(error)
  // }
}

export async function verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!(req as any).user.isAdmin) {
    res.status(403).json({ error: 'Forbidden' })
  }

  next()
}
