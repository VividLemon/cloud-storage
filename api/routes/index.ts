import { Router } from 'express'
import { rateLimiter } from '../middleware'
import { getAuthRoutes } from './auth/auth'
import { getSystemRoutes } from './system/system'
import { getUploadRoutes } from './upload/upload'
import { getUserRoutes } from './users/users'

export const getRoutes = (): Router => {
	const router = Router()
	router.use('/auth', getAuthRoutes())
	router.use('/system', rateLimiter, getSystemRoutes())
	router.use('/upload', rateLimiter, getUploadRoutes())
	router.use('/users', getUserRoutes())
	return router
}
