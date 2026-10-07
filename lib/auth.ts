import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Auth.js reads AUTH_SECRET and AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET from env.
  providers: [Google],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider !== "google") {
          return false;
        }

        await prisma.user.upsert({
          where: { email: user.email! },
          update: {},
          create: {
            name: user.name!,
            email: user.email!,
            image: user.image!,
          },
        });

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    async jwt({ token }) {
      if (token.uid) {
        return token;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: token.email!,
          },
        });

        if (existingUser) {
          token.uid = existingUser.id;
        }
      } catch (err) {
        console.error(err);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
      }

      return session;
    },
  },
});
