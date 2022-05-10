import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { verify } from 'jsonwebtoken'
import { ApiError } from '../../error'

/**
 * Gets a user from decoded jwt
 * @param request  the express request
 * @param response  the express response
 * @returns status 400 if error, otherwise decoded jwt
 */
export const show = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		next(ApiError.validationErrors(errors.array()))
		return
	}
	if (process.env.ACCESS_TOKEN_SECRET == null) {
		next(ApiError.environmentNotSet())
		return
	}
	try {
		const auth = req.headers.authorization
		if (auth == null) {
			next(ApiError.unauthorized())
			return
		}
		const [scheme, credentials] = auth.split(' ')
		if (scheme == null || scheme !== 'Bearer') {
			next(ApiError.badRequest('Auth not bearer'))
			return
		}
		if (credentials == null) {
			next(ApiError.badRequest('Auth missing credentials'))
			return
		}
		const decoded = verify(credentials, process.env.ACCESS_TOKEN_SECRET)
		res.json(decoded)
	}
	catch (err) {
		next(err)
	}
}
