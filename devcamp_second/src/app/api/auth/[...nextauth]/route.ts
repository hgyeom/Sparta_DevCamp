import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GithubProvider from 'next-auth/providers/github';
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
    // NaverProvider({
    //   clientId: process.env.NAVER_CLIENT_ID ?? '',
    //   clientSecret: process.env.NAVER_CLIENT_SECRET ?? '',
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    // }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
