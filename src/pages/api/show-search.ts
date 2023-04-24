import { createOrReturnMeiliSearchClient } from "@/meilisearch-init";
import { NextApiRequest, NextApiResponse } from "next";
import { createOrReturnFirebaseApp } from "@/firebase-init";
import { getAuth } from "firebase/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchTerms = req.query.searchTerms as string;
  
  const searchClient = createOrReturnMeiliSearchClient();

  const index = searchClient.index('shows');

  const search = await index.search(searchTerms);

  const auth = getAuth(createOrReturnFirebaseApp());

  const currentUid = auth.currentUser?.uid;

  const entries = search.hits.filter(hit => hit.uid === currentUid);
}
