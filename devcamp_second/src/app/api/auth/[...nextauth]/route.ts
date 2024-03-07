import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL = 'http://localhost:5000'; // JSON Server주소
// import NaverProvider from 'next-auth/providers/naver';
// import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await fetch(
          `${API_BASE_URL}/users?email=${credentials?.email}&password=${credentials?.password}`,
          {
            method: 'GET',
          }
        );

        const res = await response.json();
        if (res.length <= 0) {
          return null;
        }
        return res;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user && user.name) {
        token.user = {
          name: user.name,
          email: user.email,
        };
      } else if (user) {
        token.user = {
          name: user[0].name,
          email: user[0].email,
        };
      }
      return token;
    },
    session: async ({ token, session }: any) => {
      session.user = token.user;
      session.RefreshToken = token.refreshToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
