import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Username", type: "email", placeholder: "email...." },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const matched = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );

        return matched ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(
  authOptions
  // ,callbacks: {
  //   // async signIn({ user, account, profile, email, credentials }) {
  //   //   return true;
  //   // },
  //   // async redirect({ url, baseUrl }) {
  //   //   return baseUrl;
  //   // },
  //   async session({ session, user, token }) {
  //     session.user = { name: token.name };
  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     if (user) token.name = user.name;
  //     return token;
  //   },
  // },
);

export { handler as GET, handler as POST };
