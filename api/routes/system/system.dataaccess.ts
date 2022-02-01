import { join } from 'path'
import { readdir, stat } from 'fs/promises'
import { Request, Response } from 'express'

export const index = (_req: Request, res: Response) => {
	res.sendStatus(201)
}

export const getImagesSize = async (_req: Request, res: Response) => {
	const path = join(__dirname, '../', '../', 'public')
	const images = await readdir(join(path, 'images'))
	const sizes = []
	for (const file of images) {
		const { size } = await stat(join(path, 'images', file))
		sizes.push(size)
	}
	const totalSize = sizes.reduce((total, el) => total + el)
	return res.json(totalSize)
}

export const getOthersSize = async (_req: Request, res: Response) => {
	const path = join(__dirname, '../', '../', 'public')
	const other = await readdir(join(path, 'other'))
	const sizes = []
	for (const file of other) {
		const { size } = await stat(join(path, 'other', file))
		sizes.push(size)
	}
	const totalSize = sizes.reduce((total, el) => total + el)
	return res.json(totalSize)
}

export const getPublicDirSize = async (_req: Request, res: Response) => {
	const path = join(__dirname, '../', '../', 'public')
	const other = await readdir(join(path, 'other'))
	const images = await readdir(join(path, 'images'))
	const imagesArr = [0]
	const othersArr = [0]
	for (const file of other) {
		const { size } = await stat(join(path, 'other', file))
		othersArr.push(size)
	}
	for (const file of images) {
		const { size } = await stat(join(path, 'images', file))
		imagesArr.push(size)
	}
	const obj = {
		imagesSize: imagesArr.reduce((total, el) => total + el),
		othersSize: othersArr.reduce((total, el) => total + el)
	}
	return res.json(obj)
}

export const getImages = async (_req: Request, res: Response) => {
	const path = join(__dirname, '../', '../', 'public')
	const images = await readdir(join(path, 'images'))
	return res.json(images)
}

export const getOther = async (_req: Request, res: Response) => {
	const path = join(__dirname, '../', '../', 'public')
	const other = await readdir(join(path, 'other'))
	return res.json(other)
}

export const getAll = async (_req: Request, res: Response) => {
	const path = join(__dirname, '../', '../', 'public')
	const images = await readdir(join(path, 'images'))
	const other = await readdir(join(path, 'other'))
	return res.json({ images, other })
}
