import { Router } from 'express'
import passport from 'passport'
import { getPublicDirSize, getImages, getAll, getImagesSize, getOther, getOthersSize, getMaxSpace } from './system.dataaccess'

export const getSystemRoutes = () => {
	const router = Router()
	router.get('/images-size',
		passport.authenticate('jwt', { session: false }),
		getImagesSize)
	router.get('/other-size',
		passport.authenticate('jwt', { session: false }),
		getOthersSize)
	router.get('/all-size',
		passport.authenticate('jwt', { session: false }),
		getPublicDirSize)
	router.get('/max-space',
		passport.authenticate('jwt', { session: false }),
		getMaxSpace)
	router.get('/images',
		passport.authenticate('jwt', { session: false }),
		getImages)
	router.get('/other',
		passport.authenticate('jwt', { session: false }),
		getOther)
	router.get('/all',
		passport.authenticate('jwt', { session: false }),
		getAll)
	return router
}

