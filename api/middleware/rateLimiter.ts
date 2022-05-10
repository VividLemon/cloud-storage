import { NextFunction, Request, Response } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { ApiError } from '../error'

const rateLimiter = new RateLimiterMemory({
	points: 100,
	duration: 60,
	blockDuration: 60
})

export default (req: Request, _res: Response, next: NextFunction) => {
	rateLimiter.consume(req.ip)
		.then(() => {
			next()
		})
		.catch((_) => {
			next(ApiError.tooManyRequests())
		})
}
