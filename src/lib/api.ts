import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).json({ message: "Hello" });
}