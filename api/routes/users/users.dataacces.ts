import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { verify } from 'jsonwebtoken'

/**
 * Gets a user from decoded jwt
 * @param request  the express request
 * @param response  the express response
 * @returns status 400 if error, otherwise decoded jwt
 */
export const show = (req: Request, res: Response) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	const jwt = req.headers.authorization!.split(' ')[1]
	verify(jwt, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
		if (err || decoded == null) {
			return res.sendStatus(403)
		}
		else {
			return res.status(200).json(decoded)
		}
	})
}
