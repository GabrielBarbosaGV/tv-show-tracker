import { createOrReturnFirebaseApp } from "@/firebase-init";
import { ContextUser } from "./check-unauthorized-or-email-not-verified-then";
import { getAuth } from "firebase/auth";

interface UserProps {
  user: {
    emailVerified: boolean,
    email: string | null | undefined
  }
}

export const getUserProps: ContextUser<UserProps> = async _ => {
  const { currentUser } = getAuth(createOrReturnFirebaseApp());

  return {
    props: {
      user: {
        emailVerified: currentUser?.emailVerified ?? false,
        email: currentUser?.email,
        uid: currentUser?.uid
      }
    }
  };
};
