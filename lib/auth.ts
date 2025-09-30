import { NextAuthOptions } from "next-auth";
import Cognito from "next-auth/providers/cognito";

interface CognitoProfile {
  sub?: string;
  email?: string;
  name?: string;
  "cognito:groups"?: string[];
  "cognito:username"?: string;
  [key: string]: unknown;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Cognito({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      
      const cognitoProfile = profile as CognitoProfile;
      if (cognitoProfile?.["cognito:groups"]?.length) {
        token.role = cognitoProfile["cognito:groups"][0];
      } else {
        token.role = 'user';
      }
      
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken,
        user: {
          ...session.user,
          id: token.sub!,
          role: token.role as string,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};