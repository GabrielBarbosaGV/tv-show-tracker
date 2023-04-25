import { createOrReturnFirebaseApp } from "@/firebase-init";
import { Show, getShowDocByNameAndUid } from "@/persistence/show";
import { getAuth } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const showName = req.query.showName as string;

    const uid = getAuth(createOrReturnFirebaseApp()).currentUser?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const showDoc = await getShowDocByNameAndUid(showName, uid);

    if (!showDoc) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const show = showDoc.data() as Show;

    delete show.imdbLinkDetails;

    await setDoc(showDoc.ref, show);

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
