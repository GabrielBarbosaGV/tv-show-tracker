import { addShow } from "@/persistence/show";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await addShow(JSON.parse(req.body));
      res.status(200);
    } catch (err) {
      console.trace(err);
      res.status(500).json({ message: err });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
