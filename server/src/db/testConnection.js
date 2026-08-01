import { sql } from "drizzle-orm";
import { db } from "./index.js";

export async function testConnection() {
  try {
    await db.execute(sql`SELECT 1`);

    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed.");
    console.error(error);
  }
}