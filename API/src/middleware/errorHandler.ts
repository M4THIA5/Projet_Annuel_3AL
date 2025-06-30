import { Request, Response } from 'express'

async function errorHandler(req: Request, res: Response, err: any ) {
    res.status(500).json({ error: 'Internal Server Error : ' + (err.message ? `: ${err.message}` : 'no message given') })

export default errorHandler
