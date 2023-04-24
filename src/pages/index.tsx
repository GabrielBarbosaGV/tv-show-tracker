import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-around items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Movie Tracker</h1>
        <h3 className="text-xl">Track smarter, not harder</h3>
      </div>

      <div className="flex flex-col">
        <button className="bg-red-400 p-4 rounded-full" onClick={() => signIn('firebase', { callbackUrl: '/homepage' })}>
          Login to start
        </button>

        <div className="flex flex-row m-2">
          <span className="mx-1">Don&lsquo;t have an account yet?</span>
          <Link href="/signup" className="underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

