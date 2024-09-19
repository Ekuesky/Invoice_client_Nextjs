import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname.startsWith('/dashboard')) {
        // Redirect to login if not authenticated
        return !!auth?.user;
      } else if (auth?.user) {
        // Redirect authenticated users to dashboard
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
};