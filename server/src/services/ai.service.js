import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// -----------------------------------------
// Generate roadmap
// -----------------------------------------

export async function generateRoadmap(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
}

// -----------------------------------------
// Generate normal AI text
// -----------------------------------------

export async function generateText(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
}

// -----------------------------------------
// Generate AI image with Magic Hour
// -----------------------------------------

export async function generateImage(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error("Image prompt is required");
  }

  if (!process.env.MAGIC_HOUR_API_KEY) {
    throw new Error(
      "MAGIC_HOUR_API_KEY is missing from the server environment."
    );
  }

  console.log("🎨 Generating image with Magic Hour...");

  // Start image generation
  const createResponse = await fetch(
    "https://api.magichour.ai/v1/ai-image-generator",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Mentra AI Mentor",
        image_count: 1,
        model: "flux-schnell",
        aspect_ratio: "16:9",
        resolution: "auto",
        style: {
          prompt: prompt.trim(),
          tool: "general",
        },
      }),
    }
  );

  const createData = await createResponse.json();

  console.log(
    "🎨 Magic Hour response status:",
    createResponse.status
  );

  console.log(
    "🎨 Magic Hour generation:",
    createData
  );

  if (!createResponse.ok) {
    throw new Error(
      createData?.message ||
        createData?.error ||
        "Magic Hour image generation failed."
    );
  }

  const projectId = createData?.id;

  if (!projectId) {
    throw new Error(
      "Magic Hour did not return an image project ID."
    );
  }

  // Poll for completion
  const maxAttempts = 30;
  const pollDelay = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(
      `🎨 Checking image status (${attempt}/${maxAttempts})...`
    );

    const statusResponse = await fetch(
      `https://api.magichour.ai/v1/image-projects/${projectId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
        },
      }
    );

    const statusData = await statusResponse.json();

    console.log(
      "🎨 Magic Hour status:",
      statusData.status
    );

    if (!statusResponse.ok) {
      console.error(
        "MAGIC HOUR STATUS ERROR:",
        statusData
      );

      throw new Error(
        statusData?.message ||
          statusData?.error ||
          "Failed to check Magic Hour image status."
      );
    }

    // -----------------------------------------
    // Completed
    // -----------------------------------------

    if (statusData.status === "complete") {
      const imageUrl =
        statusData?.downloads?.[0]?.url;

      if (!imageUrl) {
        throw new Error(
          "Magic Hour completed the image but did not provide a download URL."
        );
      }

      console.log(
        "🎨 Magic Hour image completed!"
      );

      // Download image
      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          "Failed to download the generated Magic Hour image."
        );
      }

      const imageBuffer = Buffer.from(
        await imageResponse.arrayBuffer()
      );

      return {
        data: imageBuffer.toString("base64"),
        mimeType:
          imageResponse.headers.get("content-type") ||
          "image/png",
      };
    }

    // -----------------------------------------
    // Failed
    // -----------------------------------------

    if (
      statusData.status === "error" ||
      statusData.status === "failed"
    ) {
      console.error(
        "MAGIC HOUR IMAGE GENERATION FAILED:",
        statusData
      );

      throw new Error(
        statusData?.error?.message ||
          statusData?.message ||
          "Magic Hour failed to generate the image."
      );
    }

    // -----------------------------------------
    // Wait before checking again
    // -----------------------------------------

    await new Promise((resolve) =>
      setTimeout(resolve, pollDelay)
    );
  }

  throw new Error(
    "Magic Hour image generation timed out."
  );
}