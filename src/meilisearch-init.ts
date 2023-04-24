import MeiliSearch from "meilisearch";

let searchClient: MeiliSearch | null = null;

const createMeilisearchInstantSearchClient = () => new MeiliSearch({
  host: process.env.MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_KEY!
});

export const createOrReturnMeiliSearchClient = () => {
  if (!searchClient)
    return createMeilisearchInstantSearchClient();

  return searchClient;
};
