import { createOrReturnFirebaseApp } from "@/firebase-init";
import { getAuth } from "firebase/auth";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async _ => {
  const { currentUser } = getAuth(createOrReturnFirebaseApp());

  if (currentUser) {
    return {
      redirect: {
        destination: "/homepage",
        permanent: true
      }
    }
  }

  return {
    props: {

    }
  };
};

export default function VerifyEmail() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-around items-center">
      <div>
        <h1 className="text-xl">
          Verify your email
        </h1>

        <p className="text-md">
          A verification email has been sent to you, please verify your email address.
          Once you have done so, please log in using the button below.
        </p>
      </div>

      <button className="bg-red-400 rounded-full p-2 m-4" onClick={() => signIn()}>
        Login
      </button>
    </div>
  );
}
