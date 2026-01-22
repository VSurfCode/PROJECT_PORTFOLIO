import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  const { text, voice = "alloy" } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  const validTTSVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  if (!validTTSVoices.includes(voice)) {
    return res.status(400).json({ 
      error: `Voice "${voice}" is not available in TTS mode. Marin and Cedar are Realtime-only voices. Please disable TTS mode to use them.`,
      availableVoices: validTTSVoices
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1-hd",
        voice: voice,
        input: text,
        response_format: "mp3",
        speed: 0.95,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return res.status(200).json({ 
      audio: `data:audio/mp3;base64,${base64Audio}`,
      format: "mp3"
    });
  } catch (error) {
    console.error("Error generating TTS:", error);
    return res.status(500).json({ error: "Failed to generate speech" });
  }
}
