import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { verify, sign } from 'jsonwebtoken'
import { models } from '../../sequelize'

/**
 * Verifies the refresh token jwt and sends a new access token
 * @param req the express request
 * @param res the express response
 * @returns new access token assuming refreshtoken OK
 * @returns 401 status if errors
 */
export const verifyJWT = async (req: Request, res: Response) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.sendStatus(401)
	}
	try {
		const tokenFromDB = await models.Token.findOne({ where: { token: req.body.token } })
		if (tokenFromDB == null) {
			return res.sendStatus(403)
		}
		// if (Date.parse(get.expiresAt?.toISOString()) < Date.now()) {
		//   models.Token.destroy({ where: { token: get.token } })
		//   return res.sendStatus(403)
		// }
		// Done in verification
		verify(tokenFromDB.get('token'),
		process.env.REFRESH_TOKEN_SECRET!,
		(err: any, user: any) => {
			if (err) {
				return res.sendStatus(403)
			}
			else {
				sign({ id: user.id, name: user.name },
					process.env.ACCESS_TOKEN_SECRET!,
					{ expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES!}m` },
					(err, accessToken) => {
						if (err) {
							return res.sendStatus(403)
						}
						else {
							return res.json(accessToken)
						}
					})
				// const accessToken = generateAccessToken({ id: user.id, name: user.name, roleId: user.roleId })
				// return res.json(accessToken)
			}
		})
	}
	catch (err) {
		return res.sendStatus(500)
	}
}

/**
 * Logs a user in
 * @param req the express request
 * @param res the express response
 * @returns an access token and refresh token from user
 * @returns 401 if no user
 */
export const login = async (req: Request, res: Response) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.sendStatus(401)
	}
	try {
		const user = await models.User.findOne({
			where: {
				name: req.body.name
			}
		})
		if (!user) {
			return res.sendStatus(401)
		}
		else {
			const { id, name, password } = user.get()
			const compared = await compare(req.body.password, password)
			if (compared === false) {
				return res.sendStatus(401)
			}
			else {
				sign({ id, name },
					process.env.ACCESS_TOKEN_SECRET!,
					{ expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES!}m` },
					(err, accessToken) => {
						if (err || accessToken == null) {
							return res.sendStatus(403)
						}
						else {
							sign({ id, name },
							process.env.REFRESH_TOKEN_SECRET!,
							{ expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_MINUTES!}m` },
							async (err, refreshToken) => {
								if (err || refreshToken == null) {
									return res.sendStatus(403)
								}
								else {
									await models.Token.create({ token: refreshToken })
									return res.json({ message: 'Verified', accessToken, refreshToken })
								}
							})
						}
					})
				// const accessToken = generateAccessToken(payload)
				// const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET!)
				// const timeToExpire = Date.now() + 1000 * 60 * Number.parseInt(process.env.REFRESH_TOKEN_EXPIRE_MINUTES!)
				// models.Token.create({ token: refreshToken, expiresAt: new Date(timeToExpire) })
				// return res.json({ message: 'Verified', accessToken, refreshToken })
			}
		}
	}
	catch (err) {
		return res.status(400).json({ errors: [{ msg: 'Unexpected Issue', location: 'auth', param: 'verify' }] })
	}
}

/**
 * Expires a users refresh token
 * @param req the express request
 * @param res the express response
 * @returns successful logout message
 * @returns 500 if server issue
 */
export const logout = async (req: Request, res: Response) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.sendStatus(400)
	}
	try {
		const value = await models.Token.destroy({ where: { token: req.body.token } })
		return (value)
			? res.status(200).send('Success')
			: res.sendStatus(404)
	}
	catch (err) {
		return res.status(500).json({ errors: [{ msg: 'Unexpected Issue', location: 'auth', param: 'logout' }] })
	}
}
