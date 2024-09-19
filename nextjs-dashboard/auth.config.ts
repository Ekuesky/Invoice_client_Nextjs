import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
 callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    // Si la requête est sur le chemin du tableau de bord,
    // rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    if (nextUrl.pathname.startsWith('/dashboard')) {
      return !!auth?.user;
    }

    // Si la requête est sur le chemin de connexion,
    // retourner `true` pour permettre la page de connexion
    if (nextUrl.pathname.startsWith('/login')) {
      return true;
    }

    // Si l'utilisateur est authentifié,
    // rediriger vers le tableau de bord
    if (auth?.user) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }

    return true;
  },
},
  providers: [],
};