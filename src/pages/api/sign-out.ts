import { createOrReturnFirebaseApp } from "@/firebase-init";
import { getAuth, signOut } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await signOut(getAuth(createOrReturnFirebaseApp()));

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
