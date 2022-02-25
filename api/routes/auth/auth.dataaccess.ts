import { compare } from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { verify, sign } from 'jsonwebtoken'
import { ApiError } from '../../error'
import { models } from '../../sequelize'

/**
 * Verifies the refresh token jwt and sends a new access token
 * @param req the express request
 * @param res the express response
 * @returns new access token assuming refreshtoken OK
 * @returns 401 status if errors
 */
export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return next(ApiError.unauthorized())
	}
	const tokenFromDB = await models.Token.findOne({ where: { token: req.body.token } })
	if (tokenFromDB == null) {
		return next(ApiError.forbidden())
	}
	verify(tokenFromDB.get('token'),
		process.env.REFRESH_TOKEN_SECRET!,
		(err: any, user: any) => {
			if (err) {
				return next(ApiError.forbidden())
			}
			else {
				sign({ id: user.id, name: user.name },
					process.env.ACCESS_TOKEN_SECRET!,
					{ expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES!}m` },
					(err, accessToken) => {
						if (err) {
							return next(ApiError.forbidden())
						}
						else {
							return res.json(accessToken)
						}
					})
			}
		})
}

/**
 * Logs a user in
 * @param req the express request
 * @param res the express response
 * @returns an access token and refresh token from user
 * @returns 401 if no user
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return next(ApiError.unauthorized())
	}
	const user = await models.User.findOne({ where: { name: req.body.name } })
	if (!user) {
		return next(ApiError.unauthorized())
	}
	else {
		const { id, name, password } = user.get()
		const compared = await compare(req.body.password, password)
		if (compared === false) {
			return next(ApiError.unauthorized())
		}
		else {
			sign({ id, name },
					process.env.ACCESS_TOKEN_SECRET!,
					{ expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES!}m` },
					(err, accessToken) => {
						if (err || accessToken == null) {
							return next(ApiError.forbidden())
						}
						else {
							sign({ id, name },
							process.env.REFRESH_TOKEN_SECRET!,
							{ expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_MINUTES!}m` },
							async (err, refreshToken) => {
								if (err || refreshToken == null) {
									return next(ApiError.forbidden())
								}
								else {
									await models.Token.create({ token: refreshToken })
									return res.json({ message: 'Verified', accessToken, refreshToken })
								}
							})
						}
					})
		}
	}
}

/**
 * Expires a users refresh token
 * @param req the express request
 * @param res the express response
 * @returns successful logout message
 * @returns 500 if server issue
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	const value = await models.Token.destroy({ where: { token: req.body.token } })
	return (value)
		? res.status(200).send('Success')
		: next(ApiError.notFound('Token does not exist'))
}
