import { Request, Response, NextFunction } from 'express'

async function notFoundHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.status === 404) {
    res.status(404).json({ error: 'Not Found' })
  }
  next(err)
}

export default notFoundHandler
