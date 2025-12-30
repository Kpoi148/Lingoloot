import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      avatarUrl?: string;
      displayName?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    image?: string;
    avatarUrl?: string;
    displayName?: string;
  }
}
