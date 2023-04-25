import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import Credentials from 'next-auth/providers/credentials';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createOrReturnFirebaseApp } from '@/firebase-init';

const options = {
  providers: [
    Credentials({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your.email@gmail.com' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials) {
        try {
          const app = createOrReturnFirebaseApp();

          const auth = getAuth(app);

          const userCredentials = await signInWithEmailAndPassword(
            auth,
            credentials?.email ?? '',
            credentials?.password ?? ''
          );
          
          // Conversion to any is mandatory due to strict mode problems with NextAuth
          return userCredentials.user as any;
        } catch (err) {
          console.trace(err);
        }
      }
    })
  ],

  adapter: FirestoreAdapter()
};

const auth = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

export default auth;

