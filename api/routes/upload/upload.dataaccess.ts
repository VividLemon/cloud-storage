import { readdir, unlink } from 'fs/promises'
import { join } from 'path'
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { publicFolderPath } from '../../'
import { ApiError } from '../../error'

export const store = (req: Request, res: Response) => {
	if (!req.files) {
		return res.status(400).json({ errors: [{ msg: 'No file exists', location: 'store' }] })
	}

	// Add custom name function
	// If name is added, force it to that name, otherwise uuid it
	// TODO update will be req.file
	// This will be req.files for multiple upload, even if single
	// Another optional modifier would be to compress the image. That will determine if sharp is used.
	// Frontend will need to see the type of file. Then it will do a transition to ask if it wants to compress image.
}

export const update = (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ errors: [{ msg: 'Image file must exist', location: 'update' }] })
	}
	// TODO add change name function, req.file will be optional, vuelidate on frontend to be either or
}

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	try {
		const pathToFolder = join(publicFolderPath, req.body.folder)
		const items = await readdir(pathToFolder)
		const item = items.find((el) => el === req.body.item)
		if (item == null) {
			return next(ApiError.internal('No file by that name found!'))
		}
		await unlink(join(pathToFolder, req.body.item))
		return res.status(200).send('Deleted')
	}
	catch (err) {
		next(err)
	}
}
