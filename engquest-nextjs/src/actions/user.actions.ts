"use server";

import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongodb";
import User, { type UserRole } from "@/models/User";

const PAGE_SIZE = 10;

export type UserListItem = {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  image?: string;
  isBanned: boolean;
  createdAt?: string;
  lastLoginAt?: string;
};

export type UsersPageResult = {
  users: UserListItem[];
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
};

const ensureAdminSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized.");
  }
  return session;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toUserListItem = (user: {
  _id: unknown;
  name: string;
  displayName?: string;
  email: string;
  role?: UserRole;
  avatarUrl?: string;
  image?: string;
  isBanned?: boolean;
  createdAt?: Date;
  lastLoginAt?: Date;
}): UserListItem => ({
  id: String(user._id),
  name: user.name,
  displayName: user.displayName,
  email: user.email,
  role: user.role ?? "user",
  avatarUrl: user.avatarUrl,
  image: user.image,
  isBanned: Boolean(user.isBanned),
  createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
  lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : undefined,
});

export async function getUsers(query: string, page: number): Promise<UsersPageResult> {
  await ensureAdminSession();

  const searchValue = typeof query === "string" ? query.trim() : "";
  const pageValue = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  await connectToDatabase();

  const filter = searchValue
    ? {
        $or: [
          { name: { $regex: escapeRegex(searchValue), $options: "i" } },
          { email: { $regex: escapeRegex(searchValue), $options: "i" } },
        ],
      }
    : {};

  const totalCount = await User.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(pageValue, totalPages);

  const users = await User.find(filter)
    .select("name email role avatarUrl image displayName isBanned createdAt lastLoginAt")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();

  return {
    users: users.map((user) =>
      toUserListItem({
        _id: user._id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        image: user.image,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      })
    ),
    page: currentPage,
    totalPages,
    totalCount,
    pageSize: PAGE_SIZE,
  };
}

export async function toggleUserBan(userId: string) {
  const session = await ensureAdminSession();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  if (session.user.id === userId) {
    throw new Error("You cannot ban yourself.");
  }

  await connectToDatabase();

  const user = await User.findById(userId).select("isBanned").lean();
  if (!user) {
    throw new Error("User not found.");
  }

  const nextIsBanned = !user.isBanned;
  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: { isBanned: nextIsBanned } },
    { new: true }
  )
    .select("isBanned")
    .lean();

  return {
    id: userId,
    isBanned: updated?.isBanned ?? nextIsBanned,
  };
}

export async function toggleUserRole(userId: string) {
  await ensureAdminSession();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  await connectToDatabase();

  const user = await User.findById(userId).select("role").lean();
  if (!user) {
    throw new Error("User not found.");
  }

  const nextRole: UserRole = user.role === "admin" ? "user" : "admin";
  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: { role: nextRole } },
    { new: true }
  )
    .select("role")
    .lean();

  return {
    id: userId,
    role: (updated?.role ?? nextRole) as UserRole,
  };
}

export async function deleteUser(userId: string) {
  const session = await ensureAdminSession();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  if (session.user.id === userId) {
    throw new Error("You cannot delete your own account.");
  }

  await connectToDatabase();

  const deleted = await User.findByIdAndDelete(userId).lean();
  if (!deleted) {
    throw new Error("User not found.");
  }

  return { id: userId };
}
