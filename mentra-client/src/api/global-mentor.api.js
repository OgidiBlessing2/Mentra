
import axios from "axios";

const API_URL = "http://localhost:5000/api/ai-mentor";

async function getAuthToken(getToken) {
  if (!getToken) {
    throw new Error("Clerk getToken is not available.");
  }

  const token = await getToken();

  console.log("🔐 CLERK TOKEN CHECK:", {
    exists: !!token,
    length: token?.length || 0,
    tokenType: token ? typeof token : "none",
  });

  if (!token) {
    throw new Error(
      "Clerk authentication token was not generated. Make sure the user is fully signed in."
    );
  }

  return token;
}

export async function sendMentorMessage(message, getToken) {
  const token = await getAuthToken(getToken);

  console.log("🌐 MENTOR CHAT REQUEST");

  const response = await axios.post(
    `${API_URL}/chat`,
    {
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function generateMentorImage(prompt, getToken) {
  const token = await getAuthToken(getToken);

  console.log("🌐 MENTOR IMAGE REQUEST");

  const response = await axios.post(
    `${API_URL}/image`,
    {
      prompt,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
