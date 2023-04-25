import { createOrReturnFirebaseApp } from "@/firebase-init";
import { getShowByNameAndUid } from "@/persistence/show";
import { getAuth } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const auth = getAuth(createOrReturnFirebaseApp());

    const uid = auth?.currentUser?.uid;

    console.log(req.query);

    const showName = req.query.showName as string;

    const showAlreadyExists = await doesShowAlreadyExist(showName, uid);

    return res.status(200).json({ showAlreadyExists });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

const doesShowAlreadyExist = async (showName: string, uid?: string) => {
  if (!uid)
    return false;

  return await getShowByNameAndUid(showName, uid);
};
