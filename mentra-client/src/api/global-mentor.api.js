
import axios from "axios";

const API_URL =
  "http://localhost:5000/api/ai-mentor";

export async function sendMentorMessage(
  message,
  getToken
) {
  if (!getToken) {
    throw new Error(
      "Clerk getToken is not available."
    );
  }

  const token = await getToken();

  if (!token) {
    throw new Error(
      "Clerk authentication token was not generated."
    );
  }

  console.log(
    "🔑 Global Mentor token generated:",
    token.length,
    "characters"
  );

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

export async function generateMentorImage(
  prompt,
  getToken
) {
  if (!getToken) {
    throw new Error(
      "Clerk getToken is not available."
    );
  }

  const token = await getToken();

  if (!token) {
    throw new Error(
      "Clerk authentication token was not generated."
    );
  }

  console.log(
    "🎨 Generating Mentor image..."
  );

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