import { NextFunction, Request, Response } from 'express'
import { ApiError } from '.'
export default (err: any, _req: Request, res: Response, _next: NextFunction): void => {
	if (err instanceof ApiError) {
		res.status(err.code).json(err.message)
		return
	}

	res.status(500).json('Something went wrong')
}
