import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";

export async function syncUser(clerkUser) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id));

  if (existingUser) {
    return existingUser;
  }

//   const client = await clerkClient();

// const clerkUser = await client.users.getUser(userId);

  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    })
    .returning();

  return newUser;
}