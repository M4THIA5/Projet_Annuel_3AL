import { Prisma } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'

async function errorHandler(err: any, req: Request, res: Response) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Gérez les erreurs connues de Prisma
    res.status(400).json({ error: 'A Prisma error occurred', details: err.message })
  } else {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default errorHandler
