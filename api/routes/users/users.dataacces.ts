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
export const show = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	const auth = req.headers.authorization
	if (auth == null) {
		return next(ApiError.unauthorized())
	}
	const [scheme, credentials] = auth.split(' ')
	if (scheme == null || scheme !== 'Bearer') {
		return next(ApiError.badRequest('Auth not bearer'))
	}
	if (credentials == null) {
		return next(ApiError.badRequest('Auth missing credentials'))
	}
	verify(credentials, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
		if (err || decoded == null) {
			return next(ApiError.forbidden())
		}
		else {
			return res.json(decoded)
		}
	})
}
