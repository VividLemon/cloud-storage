import { Router } from 'express'
import { header } from 'express-validator'
import passport from 'passport'
import { show } from './users.dataacces'

/**
 * Returns an express router with the users routes
 * @returns express router
 */
export const getUserRoutes = (): Router => {
	const router = Router()
	router.get('',
		passport.authenticate('jwt', { session: false }),
		header(['authorization']).exists(),
		show)
	return router
}
