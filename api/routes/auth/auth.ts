import { Router } from 'express'
import { body } from 'express-validator'
import { login, logout, verifyJWT } from './auth.dataaccess'

/**
 * Returns an express router with the auth routes
 * @returns express router
 */
export const getAuthRoutes = (): Router => {
	const router = Router()
	router.post('/refresh',
		// Validate
		body('token').exists().isJWT(),
		// Verify
		verifyJWT)
	router.post('/login',
		// Validate
		body(['name', 'password']).exists(),
		// Login
		login)
	router.post('/logout',
		// Validate
		body('token').exists(),
		// Logout
		logout)
	return router
}
