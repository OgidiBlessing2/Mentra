import cron from "node-cron";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export function startStreakJob() {
  // Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running daily streak job...");

      // Your streak logic goes here

      console.log("Daily streak job completed.");
    } catch (error) {
      console.error("Daily streak job failed:", error);
    }
  });

  console.log("Streak cron job started.");
}