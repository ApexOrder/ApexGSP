import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider !== "discord") return;

      const discordId = account.providerAccountId;
      const ownerDiscordId = process.env.APEXPANEL_OWNER_DISCORD_ID;

      const role: Role =
        ownerDiscordId && discordId === ownerDiscordId ? "OWNER" : "ADMIN";

      await prisma.user.update({
        where: { id: user.id },
        data: {
          discordId,
          role,
        },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }

      return session;
    },
  },
});