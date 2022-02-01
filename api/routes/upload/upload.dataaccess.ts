import { Request, Response } from 'express'

export const store = (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ errors: [{ msg: 'Image file must exist', location: 'store' }] })
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

export const destroy = (_req: Request, res: Response) => {
	return res.sendStatus(200)
}
