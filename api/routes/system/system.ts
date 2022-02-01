// TODO this route will gather information on remaining file system size
// add in an env variable that will take the remaining size - max size allocated and then send
// that remaining size. Check this value every time upload is called to tell you if
// You have gone passed the allocated amount and deny you
// fsPromises.readdir(path)
// perhaps instead of reading the computer for the remaining system size,
// I put a limitter on the size of upload folder
// then, whenever request comes in, readdir and use array.reduce for sizes,
// Then send over reduced and env
import { Router } from 'express'
import passport from 'passport'
import { getPublicDirSize, getImages, getAll, getImagesSize, getOther, getOthersSize } from './system.dataaccess'

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

