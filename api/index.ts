import { join } from 'path'
import express, { json, urlencoded, static as eStatic, Request, Response } from 'express'
import passport from 'passport'
import { config as dotenvConfig } from 'dotenv'
import JwtStrategy from './passport/passport.config'
import { getRoutes } from './routes'

dotenvConfig()
const app = express()
app.use(json())
app.use(urlencoded({ extended: false }))
passport.use(JwtStrategy)

app.get('/test', (_req: Request, res: Response) => {
	return res.status(200).send('Online')
})

app.use('', getRoutes())
app.use('/images', passport.authenticate('jwt', { session: false }), eStatic(join(__dirname, 'public', 'images')))
app.use('/public', passport.authenticate('jwt', { session: false }), eStatic(join(__dirname, 'public', 'other')))

export default {
	path: '/api',
	handler: app
}
