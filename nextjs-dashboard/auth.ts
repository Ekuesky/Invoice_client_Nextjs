import NextAuth from 'next-auth';
import {authConfig} from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import {sql} from '@vercel/postgres';
import type {User} from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT *
                                     FROM users
                                     WHERE email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Levée d'une erreur plus spécifique
    throw new Error('Failed to retrieve user from the database.');
  }
}

export const {auth, signIn, signOut} = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

      if (parsedCredentials.success) {
        const {email, password} = parsedCredentials.data;
        const user = await getUser(email);

        // Validation du mot de passe:
        if (user) {
          try {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
            else return null;
          } catch (error) {
            console.error('Error comparing passwords:', error);
            //  Renvoyer null en cas de problème avec la comparaison
            return null;
          }
        } else return null;
      } else {
        console.log('Validation des identifiants incorrects');
        // Afficher un message d'erreur plus explicite en fonction des erreurs de Zod
        // Vous pouvez utiliser "parsedCredentials.error.issues" pour obtenir les messages
        // d'erreur
        return null;
      }
    },
  }),],
});