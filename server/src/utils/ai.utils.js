export function parseAIJson(result) {
	return JSON.parse(
		result
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim(),
	)
}

export function cleanAIResponse(result) {
	return result.replace(/\\n/g, "\n").trim()
}
