import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createOrReturnFirestore } from "./db";
import _ from "lodash";

export interface Show {
  id?: string,
  uid: string,
  name: string,
  lastEpisodeWatched: string,
  nextIntendedEpisode: string,
  imdbLinkDetails?: ImdbLinkDetails
}

export interface ImdbLinkDetails {
  title: string,
  imageUrl: string,
  plot: string
}

const db = createOrReturnFirestore();

export const addShow = async (show: Show) => {
  await addDoc(collection(db, 'shows'), show);
};

export const getShowDocByNameAndUid = async (name: string, uid: string) => {
  const docsRef = await getDocs(query(collection(db, 'shows'), where('name', '==', name), where('uid', '==', uid)));

  return docsRef.docs.at(0);
}

export const getShowByNameAndUid = async (name: string, uid: string) =>
  (await getShowDocByNameAndUid(name, uid))?.data() as Show;
