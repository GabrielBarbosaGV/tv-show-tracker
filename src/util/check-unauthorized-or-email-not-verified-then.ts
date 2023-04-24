import { createOrReturnFirebaseApp } from "@/firebase-init";
import { getAuth } from "firebase/auth";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export type ContextUser<T> = (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<T>>;

export const checkUnauthorizedOrEmailNotVerifiedThen = <T>(useContext: ContextUser<T>): ContextUser<T> => async (context) => {
  const { currentUser } = getAuth(createOrReturnFirebaseApp());

  if (!currentUser) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  if (!currentUser.emailVerified) {
    return {
      redirect: {
        destination: '/verify-email',
        permanent: false
      }
    };
  }

  return useContext(context);
};
