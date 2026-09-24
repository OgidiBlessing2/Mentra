import "dotenv/config";

import app from "./src/app.js";
import { testConnection } from "./src/db/testConnection.js";

const PORT = process.env.PORT || 5000;

testConnection();

app.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Mentra API running on port ${PORT}`);
});