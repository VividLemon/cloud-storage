import { Request } from 'express'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt'
import { models } from '../sequelize'

const cookieExtractor = (req: Request) => {
	const bear = 'Bearer%20'
	const cookie = req.headers.cookie?.split('; ').find((el) => el.startsWith('auth._token.local')) ?? null
	const token = cookie?.slice(cookie.indexOf(bear) + bear.length) ?? null
	return token
}

const options: StrategyOptions = {
	secretOrKey: process.env.ACCESS_TOKEN_SECRET,
	jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor])
}

export default new JwtStrategy(options, async (jwtPayload: any, done: VerifiedCallback) => {
	const user = await models.User.findByPk(jwtPayload.id)
	if (user) {
		done(null, user)
	}
	else {
		done(null, { textCode: 'TOKEN_EXPIRED' })
	}
})
