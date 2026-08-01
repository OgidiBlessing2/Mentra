export function healthCheck(req, res) {
  res.status(200).json({
    success: true,
    message: "Mentra API is healthy 🚀",
    timestamp: new Date().toISOString(),
  });
}