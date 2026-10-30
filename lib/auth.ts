import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Auth.js reads AUTH_SECRET and AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET from env.
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
