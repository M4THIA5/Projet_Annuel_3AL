import { Request, Response } from 'express'

async function errorHandler(err: any, req: Request, res: Response) {

    res.status(500).json({ error: 'Internal Server Error' })
}
export default errorHandler
