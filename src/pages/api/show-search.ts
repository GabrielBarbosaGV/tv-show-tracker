import { createOrReturnMeiliSearchClient } from "@/meilisearch-init";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchTerms = req.query.terms as string;

  const searchClient = createOrReturnMeiliSearchClient();

  const index = searchClient.index('shows');

  const search = await index.search(searchTerms);

  const currentUid = req.query.uid as string;

  const entries = search.hits.filter(hit => hit.uid === currentUid);
  
  res.status(200).json(entries);
}
