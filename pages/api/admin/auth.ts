import type { NextApiRequest, NextApiResponse } from "next";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Invalid password" });
}
