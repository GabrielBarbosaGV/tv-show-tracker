import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createOrReturnFirebaseApp } from '@/firebase-init';

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      alert('The given password and password confirmation do not match');
    } else {
      try {
        setIsLoading(true);

        const auth = getAuth(createOrReturnFirebaseApp());

        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(user);

        router.push('/homepage');
      } catch (err) {
        alert('An error has occurred when trying to create your account');

        console.trace(err);
      }
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          className="bg-gray-200 p-2 m-4 rounded-md"
          type="text"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <input
          className="bg-gray-200 p-2 m-4 rounded-md"
          type="password"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <input
          className="bg-gray-200 p-2 m-4 rounded-md"
          type="password"
          placeholder="Password confirmation"
          value={passwordConfirmation}
          onChange={event => setPasswordConfirmation(event.target.value)}
        />

        <input
          className="bg-red-400 p-2 rounded-full cursor-pointer"
          type="submit"
          value="Do it"
        />
      </form>

      {isLoading
        ? <span>Please hold as you&lsquotre logged in...</span>
        : <></>}
      
    </div>
  );
}
