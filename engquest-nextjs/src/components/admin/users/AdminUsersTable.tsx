"use client";

import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Gem, MoreHorizontal, Pencil, Sparkles, Trophy } from "lucide-react";
import { FrameRenderer } from "@/components/shop/FrameRenderer";
import type { UserListItem } from "@/actions/admin/user.actions";
import type { ShopVisualItem } from "@/types/shop-item";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return dateFormatter.format(date);
};

const getAvatarSource = (user: UserListItem) =>
  user.avatarUrl ?? user.image ?? "/logo.png";

const getDisplayName = (user: UserListItem) => user.displayName ?? user.name;

type AdminUsersTableProps = {
  users: UserListItem[];
  isBusy: boolean;
  hasUsers: boolean;
  currentUserId?: string;
  openMenuId: string | null;
  setOpenMenuId: Dispatch<SetStateAction<string | null>>;
  shopItems: ShopVisualItem[];
  onEdit: (user: UserListItem) => void;
  onToggleRole: (userId: string) => void;
  onToggleBan: (userId: string) => void;
  onDelete: (userId: string, label: string) => void;
};

type UserActionsMenuProps = {
  user: UserListItem;
  isAdmin: boolean;
  isBanned: boolean;
  isSelf: boolean;
  openMenuId: string | null;
  setOpenMenuId: Dispatch<SetStateAction<string | null>>;
  onEdit: (user: UserListItem) => void;
  onToggleRole: (userId: string) => void;
  onToggleBan: (userId: string) => void;
  onDelete: (userId: string, label: string) => void;
};

function UserActionsMenu({
  user,
  isAdmin,
  isBanned,
  isSelf,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onToggleRole,
  onToggleBan,
  onDelete,
}: UserActionsMenuProps) {
  return (
    <div className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenMenuId((prev) => (prev === user.id ? null : user.id));
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        aria-haspopup="menu"
        aria-expanded={openMenuId === user.id}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {openMenuId === user.id && (
        <div
          className="absolute right-0 top-11 z-10 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              onEdit(user);
              setOpenMenuId(null);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pencil className="h-4 w-4" />
            Edit User
          </button>
          <button
            type="button"
            onClick={() => onToggleRole(user.id)}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isAdmin ? "Demote Admin" : "Promote Admin"}
          </button>
          <button
            type="button"
            onClick={() => onToggleBan(user.id)}
            disabled={isSelf}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              isSelf
                ? "cursor-not-allowed text-slate-300 dark:text-slate-600"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {isBanned ? "Unban User" : "Ban User"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(user.id, getDisplayName(user))}
            disabled={isSelf}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              isSelf
                ? "cursor-not-allowed text-red-200 dark:text-red-900/40"
                : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            }`}
          >
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersTable({
  users,
  isBusy,
  hasUsers,
  currentUserId,
  openMenuId,
  setOpenMenuId,
  shopItems,
  onEdit,
  onToggleRole,
  onToggleBan,
  onDelete,
}: AdminUsersTableProps) {
  const frameById = useMemo(
    () =>
      new Map(shopItems.map((item) => [String(item._id), item])),
    [shopItems]
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-white text-xs uppercase tracking-[0.25em] text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
          <tr>
            <th className="py-4 px-4 font-semibold">User</th>
            <th className="py-4 px-4 font-semibold">Role</th>
            <th className="py-4 px-4 font-semibold">Status</th>
            <th className="py-4 px-4 text-center font-semibold">Level</th>
            <th className="py-4 px-4 text-center font-semibold">XP</th>
            <th className="py-4 px-4 text-center font-semibold">Gems</th>
            <th className="py-4 px-4 font-semibold">Joined</th>
            <th className="py-4 px-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {isBusy && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-slate-400 dark:text-slate-500">
                Loading users...
              </td>
            </tr>
          )}

          {!isBusy && !hasUsers && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-slate-400 dark:text-slate-500">
                No users found.
              </td>
            </tr>
          )}

          {!isBusy &&
            users.map((user) => {
              const isAdmin = user.role === "admin";
              const isBanned = user.isBanned;
              const isSelf = currentUserId === user.id;
              const equippedFrameId = user.gamification?.equippedFrame;
              const frameItem = equippedFrameId
                ? frameById.get(String(equippedFrameId))
                : undefined;

              return (
                <tr key={user.id} className={isBanned ? "bg-red-50/40 dark:bg-red-900/10" : ""}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 flex-shrink-0">
                        <FrameRenderer
                          frameKey={frameItem?.renderKey}
                          fallbackImageUrl={frameItem?.imageUrl}
                          avatarUrl={getAvatarSource(user)}
                          className="h-full w-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-200">
                          {getDisplayName(user)}
                          {isSelf ? " (You)" : ""}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        isAdmin
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        isBanned
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
                      }`}
                    >
                      {isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-2.5 py-1 dark:from-amber-900/40 dark:to-yellow-900/40">
                      <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                        {user.gamification?.level ?? 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-2.5 py-1 dark:from-violet-900/40 dark:to-purple-900/40">
                      <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                      <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                        {(user.gamification?.xp ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-100 to-teal-100 px-2.5 py-1 dark:from-cyan-900/40 dark:to-teal-900/40">
                      <Gem className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                        {(user.gamification?.currency ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600 dark:text-slate-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 text-right">
                    <UserActionsMenu
                      user={user}
                      isAdmin={isAdmin}
                      isBanned={isBanned}
                      isSelf={isSelf}
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                      onEdit={onEdit}
                      onToggleRole={onToggleRole}
                      onToggleBan={onToggleBan}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
