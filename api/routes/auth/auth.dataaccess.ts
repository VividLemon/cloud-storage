import { compare } from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { verify, sign } from 'jsonwebtoken'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { ApiError } from '../../error'
import { models } from '../../sequelize'

const maxWrongAttemptsByIPperDay = 100
const maxConsecutiveFailsByUsernameAndIP = 10

const limiterSlowBruteByIP: RateLimiterMemory = new RateLimiterMemory({
	keyPrefix: 'login_fail_ip_per_day',
	points: maxWrongAttemptsByIPperDay,
	duration: 60 * 60 * 24,
	blockDuration: 60 * 60 * 24
})

const limiterConsecutiveFailsByUsernameAndIP: RateLimiterMemory = new RateLimiterMemory({
	keyPrefix: 'login_fail_consecutive_username_and_ip',
	points: maxConsecutiveFailsByUsernameAndIP,
	duration: 60 * 60 * 24 * 90,
	blockDuration: 60 * 60
})

/**
 * Verifies the refresh token jwt and sends a new access token
 * @param req the express request
 * @param res the express response
 * @returns new access token assuming refreshtoken OK
 * @returns 401 status if errors
 */
export const verifyJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		next(ApiError.unauthorized())
		return
	}
	if (process.env.ACCESS_TOKEN_SECRET == null || process.env.ACCESS_TOKEN_EXPIRE_MINUTES == null || process.env.REFRESH_TOKEN_SECRET == null) {
		next(ApiError.environmentNotSet())
		return
	}
	try {
		const tokenFromDB = await models.Token.findOne({ where: { token: req.body.token } })
		if (tokenFromDB == null) {
			return next(ApiError.forbidden())
		}
		const token = verify(tokenFromDB.get('token'), process.env.REFRESH_TOKEN_SECRET)
		if (typeof token === 'string') {
			next(ApiError.forbidden('Token incorrect'))
			return
		}
		if (token.id == null || token.name == null) {
			next(ApiError.forbidden('Token incorrect'))
			return
		}
		const accessToken = sign({ id: token.id, name: token.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}m` })
		res.json(accessToken)
	}
	catch (err) {
		next(err)
	}
}

/**
 * Logs a user in
 * @param req the express request
 * @param res the express response
 * @returns an access token and refresh token from user
 * @returns 401 if no user
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const ipAddr = req.ip
	const usernameIpKey = `${req.body.name}_${ipAddr}`
	const [resUsernameAndIP, resSlowByIP] = await Promise.all([
		limiterConsecutiveFailsByUsernameAndIP.get(usernameIpKey),
		limiterSlowBruteByIP.get(ipAddr)
	])

	if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
		const retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
		res.set('Retry-After', retrySecs.toString())
		next(ApiError.tooManyRequests())
		return
	}
	else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
		const retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
		res.set('Retry-After', retrySecs.toString())
		next(ApiError.tooManyRequests('Too many failed login attempts'))
		return
	}
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		next(ApiError.unauthorized())
		return
	}
	if (process.env.ACCESS_TOKEN_SECRET == null || process.env.ACCESS_TOKEN_EXPIRE_MINUTES == null || process.env.REFRESH_TOKEN_SECRET == null || process.env.REFRESH_TOKEN_EXPIRE_MINUTES == null) {
		next(ApiError.environmentNotSet())
		return
	}
	try {
		const user = await models.User.findOne({ where: { name: req.body.name } })
		const promises = [limiterSlowBruteByIP.consume(ipAddr)]
		if (!user) {
			await Promise.all(promises)
			next(ApiError.unauthorized())
			return
		}
		const { id, name, password } = user.get()
		const compared = await compare(req.body.password, password)
		if (compared === false) {
			promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIpKey))
			await Promise.all(promises)
			next(ApiError.unauthorized())
			return
		}
		const accessToken = sign({ id, name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}m` })
		const refreshToken = sign({ id, name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_MINUTES}m` })
		await models.Token.create({ token: refreshToken })
		await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIpKey)
		res.json({ message: 'Verified', accessToken, refreshToken })
	}
	catch (err) {
		next(err)
	}
}

/**
 * Expires a users refresh token
 * @param req the express request
 * @param res the express response
 * @returns successful logout message
 * @returns 500 if server issue
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		next(ApiError.validationErrors(errors.array()))
		return
	}
	try {
		const value = await models.Token.destroy({ where: { token: req.body.token } })
		if (!value) {
			next(ApiError.notFound('Token does not exist'))
			return
		}
		res.send('Success')
	}
	catch (err) {
		next(err)
	}
}
