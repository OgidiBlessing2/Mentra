import { clerkClient, getAuth } from "@clerk/express";
import { syncUser } from "../services/user.service.js";

export async function protect(req, res, next) {
  try {
    console.log("🔐 PROTECT START");

    const auth = getAuth(req, {
      acceptsToken: "session_token",
    });

    console.log("🔐 Clerk auth state:", {
      isAuthenticated: auth.isAuthenticated,
      userId: auth.userId,
      sessionId: auth.sessionId,
      tokenType: auth.tokenType,
    });

    if (!auth.isAuthenticated || !auth.userId) {
      console.log(
        "❌ PROTECT: Clerk did not authenticate request"
      );

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ...rest of your existing protect logic

    console.log("✅ PROTECT: User authenticated");
    console.log("🔎 Clerk user ID:", auth.userId);

    const clerkUser = await clerkClient.users.getUser(
      auth.userId
    );

    console.log("✅ Clerk user retrieved");

    const dbUser = await syncUser(clerkUser);

    console.log("✅ Database user synced:", {
      id: dbUser.id,
      clerkId: dbUser.clerkId,
      email: dbUser.email,
    });

    req.user = dbUser;

    console.log("✅ PROTECT COMPLETE");

    next();
  } catch (error) {
    console.error("❌ PROTECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Authentication error",
    });
  }
}