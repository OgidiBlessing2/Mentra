import { db } from "./index.js";
import { achievements } from "./schema/achievements.js";

const achievementData = [
  {
    key: "first_lesson",
    name: "First Step",
    description: "Complete your first lesson",
    icon: "🎯",
    requirementType: "lessons",
    requirementValue: 1,
  },

  {
    key: "five_lessons",
    name: "Getting Started",
    description: "Complete 5 lessons",
    icon: "📚",
    requirementType: "lessons",
    requirementValue: 5,
  },

  {
    key: "xp_hunter",
    name: "XP Hunter",
    description: "Earn 100 XP",
    icon: "⭐",
    requirementType: "xp",
    requirementValue: 100,
  },

  {
    key: "three_day_streak",
    name: "On Fire",
    description: "Maintain a 3-day learning streak",
    icon: "🔥",
    requirementType: "streak",
    requirementValue: 3,
  },

  {
    key: "seven_day_streak",
    name: "Unstoppable",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    requirementType: "streak",
    requirementValue: 7,
  },

  {
    key: "quiz_master",
    name: "Quiz Master",
    description: "Get a perfect quiz score",
    icon: "🧠",
    requirementType: "perfect_quiz",
    requirementValue: 100,
  },

  {
    key: "level_five",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "🏆",
    requirementType: "level",
    requirementValue: 5,
  },
];

async function seedAchievements() {
  console.log("🏆 Seeding achievements...");

  for (const achievement of achievementData) {
    await db
      .insert(achievements)
      .values(achievement)
      .onConflictDoNothing({
        target: achievements.key,
      });
  }

  console.log("✅ Achievements seeded!");

  process.exit(0);
}

seedAchievements().catch((error) => {
  console.error("❌ Failed to seed achievements:");
  console.error(error);
  process.exit(1);
});