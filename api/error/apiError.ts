import { ValidationError } from 'express-validator'

export default class ApiError {
	code: number
	message: string

	constructor(code: number, message: string) {
		this.code = code
		this.message = message
	}

	static badRequest(message: string) {
		return new ApiError(400, message)
	}

	static internal(message: string) {
		return new ApiError(500, message)
	}

	static forbidden(message = 'Forbidden') {
		return new ApiError(403, message)
	}

	static unauthorized(message = 'Unauthorized') {
		return new ApiError(401, message)
	}

	static notFound(message = 'Not found') {
		return new ApiError(404, message)
	}

	static validationErrors(errors: Array<ValidationError>) {
		return new ApiError(400, `Incorrect fields: ${errors.map((el) => `${el.param} in ${el.location}`).join(', ')}`)
	}

	static environmentNotSet() {
		return new ApiError(500, 'Environment Variables not set')
	}

	static tooManyRequests(message = 'Too many requests') {
		return new ApiError(429, message)
	}
}
