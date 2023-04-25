import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { createOrReturnFirebaseApp } from '@/firebase-init';
import { GetServerSideProps } from 'next';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { currentUser } = getAuth(createOrReturnFirebaseApp());

  if (currentUser) {
    return {
      redirect: {
        destination: '/homepage',
        permanent: true
      }
    }
  }

  return {
    props: {

    }
  };
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = () => {
    setIsLoading(true);
    signIn();
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-around items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Movie Tracker</h1>
        <h3 className="text-xl">Track smarter, not harder</h3>
      </div>

      <div className="flex flex-col justify-center items-center">
        <button className="bg-red-400 p-4 rounded-full" onClick={() => handleLoginClick()}>
          Login to start
        </button>

        <div className="flex flex-row m-2">
          <span className="mx-1">Don&lsquo;t have an account yet?</span>
          <Link href="/signup" className="underline">Sign up</Link>
        </div>
      </div>

      {isLoading && (
        <span className="text-blue-800">
          Loading...
        </span>
      )}
    </div>
  );
}

