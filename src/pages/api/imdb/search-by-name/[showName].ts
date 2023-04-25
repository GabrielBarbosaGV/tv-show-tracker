import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const API_KEY = process.env.IMDB_API_KEY;

    const showName = req.query.showName;

    const response = await fetch(`https://imdb-api.com/en/API/Search/${API_KEY}/${showName}`);

    res.status(200).json(await response.json());
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
