import { Router } from 'express'
import { getAuthRoutes } from './auth/auth'
import { getSystemRoutes } from './system/system'
import { getUploadRoutes } from './upload/upload'
import { getUserRoutes } from './users/users'

export const getRoutes = () => {
	const router = Router()
	router.use('/auth', getAuthRoutes())
	router.use('/system', getSystemRoutes())
	router.use('/upload', getUploadRoutes())
	router.use('/users', getUserRoutes())
	return router
}
