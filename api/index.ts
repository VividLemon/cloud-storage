import { join } from 'path'
import { mkdirSync } from 'fs'
import express, { json, urlencoded, static as eStatic, Request, Response } from 'express'
import passport from 'passport'
import { config as dotenvConfig } from 'dotenv'
import helmet from 'helmet'
import JwtStrategy from './passport/passport.config'
import { getRoutes } from './routes'
import { apiErrorHandler } from './error'

dotenvConfig()
const app = express()
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(helmet())
passport.use(JwtStrategy)

app.get('/test', (_req: Request, res: Response): void => {
	res.send('Online')
})

const publicFolderPath = join(process.env.PUBLIC_FOLDER_ROOT_PATH ?? join(process.cwd(), 'api'), 'public')
const imagesPublicFolderPath = join(publicFolderPath, 'images')
const otherPublicFolderPath = join(publicFolderPath, 'other')
mkdirSync(imagesPublicFolderPath, { recursive: true })
mkdirSync(otherPublicFolderPath, { recursive: true })

app.use('', getRoutes())
app.use('/public', passport.authenticate('jwt', { session: false }), eStatic(publicFolderPath))

app.use(apiErrorHandler)

export {
	publicFolderPath,
	imagesPublicFolderPath,
	otherPublicFolderPath
}
export default {
	path: '/api',
	handler: app
}
