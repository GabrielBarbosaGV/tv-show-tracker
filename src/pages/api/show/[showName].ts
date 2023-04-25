import { createOrReturnFirebaseApp } from "@/firebase-init";
import { Show, getShowDocByNameAndUid } from "@/persistence/show";
import { getAuth } from "firebase/auth";
import { deleteDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const show = JSON.parse(req.body) as Show;

    const uid = getAuth(createOrReturnFirebaseApp()).currentUser?.uid;

    const showDoc = await getShowDocByNameAndNullableUid(show.name, uid);

    if (!showDoc) {
      res.status(404).json({ message: 'Show not found' });
      return;
    }

    await setDoc(showDoc.ref, show);

    res.status(200).json({ message: 'Show updated' });
  } else if (req.method === 'DELETE') {
    const showName = req.query.showName as string;

    const uid = getAuth(createOrReturnFirebaseApp()).currentUser?.uid;

    if (!uid) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const showDoc = await getShowDocByNameAndUid(showName, uid);

    if (!showDoc) {
      res.status(404).json({ message: 'Show not found'});
      return;
    }

    await deleteDoc(showDoc.ref);

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

const getShowDocByNameAndNullableUid = (name: string, uid?: string) => {
  if (!uid)
    return null;

  return getShowDocByNameAndUid(name, uid);
};
