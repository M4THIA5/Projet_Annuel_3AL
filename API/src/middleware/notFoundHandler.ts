import { Prisma } from '../../prisma/postgre/client';
import { Request, Response, NextFunction } from 'express';

function notFoundHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(404).json({ error: 'Not Found', details: err.message });
  } else if (err.status === 404) {
    res.status(404).json({ error: 'Not Found' });
  }
  next(err);
}

export default notFoundHandler;