import { Router } from 'express'
import passport from 'passport'
import multer from 'multer'
import { store, update, destroy } from './upload.dataaccess'

const accepts = ['image/jpeg', 'image/png', 'image/gif']
const mult = multer({
	limits: {
		fileSize: 1024 * 1024 * 100
	},
	fileFilter: (_req, file, cb) => {
		if (accepts.includes(file.mimetype)) {
			cb(null, true)
		}
		else {
			cb(null, false)
			// TODO see if this works
			return cb(new Error(`Only, ${accepts.join(', ')} formats allowed`))
		}
	}
})

export const getUploadRoutes = () => {
	const router = Router()
	router.post('',
		passport.authenticate('jwt', { session: false }),
		mult.single('file'),
		store)
	router.put('/:id',
		passport.authenticate('jwt', { session: false }),
		mult.single('file'),
		update)
	router.delete('/:id',
		passport.authenticate('jwt', { session: false }),
		destroy)
	return router
}
