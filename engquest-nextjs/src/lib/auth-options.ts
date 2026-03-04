import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import User from "../models/User";
import { connectToDatabase } from "./mongodb";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoClient = new MongoClient(MONGODB_URI);
const clientPromise = global._mongoClientPromise ?? mongoClient.connect();

if (!global._mongoClientPromise) {
  global._mongoClientPromise = clientPromise;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email })
          .select("email password name role avatarUrl image displayName isBanned")
          .lean();
        if (!user || !user.password) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatches) {
          return null;
        }

        if (user.isBanned) {
          return null;
        }

        await User.updateOne(
          { _id: user._id },
          { $set: { lastLoginAt: new Date() } }
        );

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role ?? "user",
          image: user.avatarUrl ?? user.image ?? "/logo.png",
          avatarUrl: user.avatarUrl ?? user.image ?? "/logo.png",
          displayName: user.displayName ?? user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        token.name = (user as { name?: string }).name ?? token.name;
        token.image = (user as { image?: string }).image ?? token.image;
        token.avatarUrl =
          (user as { avatarUrl?: string }).avatarUrl ?? token.avatarUrl;
        token.displayName =
          (user as { displayName?: string }).displayName ?? token.displayName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as {
          id?: string;
          role?: string;
          name?: string;
          image?: string;
          avatarUrl?: string;
          displayName?: string;
        };
        sessionUser.id = token.id as string;
        sessionUser.role = token.role as string;
        if (token.name) {
          sessionUser.name = token.name as string;
        }
        if (token.image) {
          sessionUser.image = token.image as string;
        }
        if (token.avatarUrl) {
          sessionUser.avatarUrl = token.avatarUrl as string;
        }
        if (token.displayName) {
          sessionUser.displayName = token.displayName as string;
        }
      }
      return session;
    },
  },
};
