import { createOrReturnFirebaseApp } from "@/firebase-init";
import { Show, getShowDocByNameAndUid } from "@/persistence/show";
import { getAuth } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const imdbId = req.query.imdbId as string;
    const showName = req.query.showName as string;

    const uid = getAuth(createOrReturnFirebaseApp()).currentUser?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const showDoc = await getShowDocByNameAndUid(showName, uid);

    if (!showDoc) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    const response = await fetch(`https://imdb-api.com/en/API/Title/${process.env.IMDB_API_KEY}/${imdbId}`);

    const json = await response.json();

    const show = showDoc?.data() as Show;

    const { fullTitle, image, plot } = json;

    const updatedShow: Show = {
      ...show,
      imdbLinkDetails: {
        title: fullTitle,
        imageUrl: image,
        plot
      }
    };

    await setDoc(showDoc.ref, updatedShow);

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
