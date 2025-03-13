import { Prisma } from '../../prisma/postgre/client';
import { Request, Response, NextFunction } from 'express';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Gérez les erreurs connues de Prisma
    res.status(400).json({ error: 'A Prisma error occurred', details: err.message });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default errorHandler;
