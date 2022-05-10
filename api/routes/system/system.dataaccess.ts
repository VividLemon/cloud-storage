import { join } from 'path'
import { readdir, stat } from 'fs/promises'
import { NextFunction, Request, Response } from 'express'
import { imagesPublicFolderPath, otherPublicFolderPath } from '../../'

export const getImagesSize = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const images = await readdir(imagesPublicFolderPath)
		const sizes = []
		for (const file of images) {
			const { size } = await stat(join(imagesPublicFolderPath, file))
			sizes.push(size)
		}
		const totalSize = sizes.reduce((total, el) => total + el, 0)
		res.json(totalSize)
	}
	catch (err) {
		next(err)
	}
}

export const getOthersSize = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const other = await readdir(otherPublicFolderPath)
		const sizes = []
		for (const file of other) {
			const { size } = await stat(join(otherPublicFolderPath, file))
			sizes.push(size)
		}
		const totalSize = sizes.reduce((total, el) => total + el, 0)
		res.json(totalSize)
	}
	catch (err) {
		next(err)
	}
}

export const getPublicDirSize = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const other = await readdir(otherPublicFolderPath)
		const images = await readdir(imagesPublicFolderPath)
		const imagesArr = []
		const othersArr = []
		for (const file of other) {
			const { size } = await stat(join(otherPublicFolderPath, file))
			othersArr.push(size)
		}
		for (const file of images) {
			const { size } = await stat(join(imagesPublicFolderPath, file))
			imagesArr.push(size)
		}
		const obj = {
			imagesSize: imagesArr.reduce((total, el) => total + el, 0),
			othersSize: othersArr.reduce((total, el) => total + el, 0)
		}
		res.json(obj)
	}
	catch (err) {
		next(err)
	}
}

export const getMaxSpace = (_req: Request, res: Response, _next: NextFunction): void => {
	const space = (process.env.MAX_SPACE_ALLOWED_BYTES != null) ? Number.parseInt(process.env.MAX_SPACE_ALLOWED_BYTES) : 0
	res.json(space)
}

export const getImages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const images = (await readdir(imagesPublicFolderPath)).map((el) => join('images', el))
		res.json(images)
	}
	catch (err) {
		next(err)
	}
}

export const getOther = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const other = (await readdir(otherPublicFolderPath)).map((el) => join('other', el))
		res.json(other)
	}
	catch (err) {
		next(err)
	}
}

export const getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const images = (await readdir(imagesPublicFolderPath)).map((el) => join('images', el))
		const other = (await readdir(otherPublicFolderPath)).map((el) => join('other', el))
		res.json({ images, other })
	}
	catch (err) {
		next(err)
	}
}
