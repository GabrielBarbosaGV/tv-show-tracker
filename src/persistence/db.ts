import { createOrReturnFirebaseApp } from "@/firebase-init";
import { Firestore, getFirestore } from "firebase/firestore";

let firestore: Firestore | null = null;

export function createOrReturnFirestore() {
  if (firestore === null)
    firestore = getFirestore(createOrReturnFirebaseApp());

  return firestore;
}
