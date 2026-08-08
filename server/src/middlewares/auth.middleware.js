
import { clerkClient, getAuth } from "@clerk/express";
import { syncUser } from "../services/user.service.js";

export async function protect(req, res, next) {
  try {
    console.log("🔐 PROTECT START");

    const auth = getAuth(req);

    console.log("🔐 Auth:", {
      isAuthenticated: auth.isAuthenticated,
      userId: auth.userId,
      sessionId: auth.sessionId,
    });

    if (!auth.isAuthenticated || !auth.userId) {
      console.log("❌ PROTECT: No authenticated user");

      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log("✅ PROTECT: User authenticated");

    console.log(
      "🔎 Getting Clerk user:",
      auth.userId
    );

    const clerkUser =
      await clerkClient.users.getUser(
        auth.userId
      );

    console.log("✅ Clerk user retrieved");

    console.log("🔄 Syncing user...");

    const dbUser = await syncUser(
      clerkUser
    );

    console.log("✅ User synced:", dbUser);

    req.user = dbUser;

    console.log("✅ PROTECT COMPLETE");

    next();

  } catch (error) {
    console.error("❌ PROTECT ERROR");
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}
