import { clerkClient, getAuth } from "@clerk/express";
import { syncUser } from "../services/user.service.js";

export async function protect(req, res, next) {
  try {
    const auth = getAuth(req);

    console.log("Auth object:", auth);

    if (!auth.isAuthenticated || !auth.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const clerkUser = await clerkClient.users.getUser(auth.userId);

    const dbUser = await syncUser(clerkUser);

    req.user = dbUser;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}