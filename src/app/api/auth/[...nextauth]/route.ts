/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';

const authOptions = {
  providers: [
    {
      id: 'spotify',
      name: 'Spotify',
      type: 'oauth',
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        params: {
          scope: 'user-read-email user-read-private user-read-currently-playing user-read-playback-state streaming'
        }
      },
      token: 'https://accounts.spotify.com/api/token',
      userinfo: 'https://api.spotify.com/v1/me',
      profile(profile: any) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url
        };
      }
    }
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
  pages: {
    signIn: '/'
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false
      }
    }
  },
  useSecureCookies: false
};

const handler = (NextAuth as any)(authOptions);

export { handler as GET, handler as POST };