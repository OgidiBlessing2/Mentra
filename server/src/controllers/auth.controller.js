import { registerUser } from "../services/auth.service.js"

export async function register(req, res) {
	try {
		const result = await registerUser(req.body)

		return res.status(201).json(result)
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message,
		})
	}
}
