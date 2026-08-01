import app from "./src/app.js";
import dotenv from "dotenv";
import { testConnection } from "./src/db/testConnection.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

testConnection();

app.listen(PORT, () => {
  console.log(`🚀 Mentra API running on port ${PORT}`);
});