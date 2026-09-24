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

    if (!email) {
      throw new Error("Clerk user does not have an email address");
    }

    // 3. Build display name
    const name =
      [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || null;

    // 4. Create user
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        email,
        name,
        username: clerkUser.username || null,
        avatar: clerkUser.imageUrl || null,
        bio: null,
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

/**
 * Update the authenticated user's Mentra profile.
 */
export async function updateUserProfile(userId, profileData) {
  try {
    console.log("✏️ updateUserProfile START");
    console.log("👤 User ID:", userId);

    const { username, bio } = profileData;

    const updateData = {
      updatedAt: new Date(),
    };

    if (username !== undefined) {
      updateData.username = username?.trim() || null;
    }

    if (bio !== undefined) {
      updateData.bio = bio?.trim() || null;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    console.log("✅ User profile updated:", updatedUser.id);

    return updatedUser;
  } catch (error) {
    console.error("❌ updateUserProfile ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Detail:", error.detail);

    throw error;
  }
}