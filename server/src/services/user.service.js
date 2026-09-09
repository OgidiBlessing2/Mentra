import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";

export async function syncUser(clerkUser) {
  try {
    console.log("🔄 syncUser START");
    console.log("👤 Clerk ID:", clerkUser.id);

    // 1. Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (existingUser) {
      console.log("✅ User already exists:", existingUser.id);
      return existingUser;
    }

    console.log("🆕 User does not exist. Creating user...");

    // 2. Safely get email
    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress || null;

    // 3. Create user
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        imageUrl: clerkUser.imageUrl || null,
      })
      .returning();

    console.log("✅ New user created:", newUser.id);

    return newUser;
  } catch (error) {
    console.error("❌ syncUser ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Detail:", error.detail);
    console.error("Cause:", error.cause);

    throw error;
  }
}
