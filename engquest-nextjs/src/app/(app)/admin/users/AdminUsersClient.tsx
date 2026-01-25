"use client";

import { useEffect, useRef, useState, useTransition, useOptimistic } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, MoreHorizontal, Coins, Star, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { FrameRenderer } from "@/lib/frame-registry";
import EditUserModal from "@/components/admin/EditUserModal";
import {
  deleteUser,
  getUsers,
  toggleUserBan,
  toggleUserRole,
  type UserListItem,
  type UsersPageResult,
} from "@/actions/user.actions";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

type AdminUsersClientProps = {
  initialData: UsersPageResult | null;
  initialError?: string | null;
  initialQuery: string;
  initialPage: number;
  currentUserId?: string;
};

type OptimisticAction = {
  type: "ban";
  userId: string;
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return dateFormatter.format(date);
};

const getDisplayName = (user: UserListItem) => user.displayName ?? user.name;

export default function AdminUsersClient({
  initialData,
  initialError = null,
  initialQuery,
  initialPage,
  currentUserId,
}: AdminUsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<UsersPageResult | null>(initialData);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(!initialData);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null); // New state for editing
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const initialLoadRef = useRef(true);

  const queryParam = searchParams.get("q") ?? "";
  const pageParam = searchParams.get("page") ?? "1";
  const parsedPage = Number.parseInt(pageParam, 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const searchParamsString = searchParams.toString();

  const users = data?.users ?? [];

  const [optimisticUsers, updateOptimisticUsers] = useOptimistic(
    users,
    (state: UserListItem[], action: OptimisticAction) => {
      if (action.type !== "ban") return state;
      return state.map((user) =>
        user.id === action.userId
          ? { ...user, isBanned: !user.isBanned }
          : user
      );
    }
  );

  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const trimmed = searchValue.trim();
    if (trimmed === queryParam) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue, queryParam, router, searchParamsString]);

  useEffect(() => {
    let active = true;

    const shouldSkipInitial =
      initialLoadRef.current &&
      initialData &&
      queryParam === initialQuery &&
      currentPage === initialPage;

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
    }

    if (shouldSkipInitial) {
      return undefined;
    }

    startTransition(() => {
      setLoading(true);
      getUsers(queryParam, currentPage)
        .then((result) => {
          if (!active) return;
          setData(result);
          setError(null);
          if (result.page !== currentPage) {
            const params = new URLSearchParams(searchParamsString);
            params.set("page", String(result.page));
            router.replace(`?${params.toString()}`);
          }
        })
        .catch((fetchError) => {
          if (!active) return;
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load users."
          );
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    });

    return () => {
      active = false;
    };
  }, [
    currentPage,
    initialData,
    initialPage,
    initialQuery,
    queryParam,
    router,
    searchParamsString,
    startTransition,
  ]);

  useEffect(() => {
    if (!openMenuId) return undefined;

    const handleClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [openMenuId]);

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParamsString);
    params.set("page", String(nextPage));
    router.push(`?${params.toString()}`);
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsers(queryParam, currentPage);
      setData(result);
      setError(null);
      if (result.page !== currentPage) {
        const params = new URLSearchParams(searchParamsString);
        params.set("page", String(result.page));
        router.replace(`?${params.toString()}`);
      }
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string) => {
    updateOptimisticUsers({ type: "ban", userId });
    setOpenMenuId(null);
    try {
      const result = await toggleUserBan(userId);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((user) =>
            user.id === userId ? { ...user, isBanned: result.isBanned } : user
          ),
        };
      });
      toast.success(result.isBanned ? "User banned." : "User unbanned.");
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to update user."
      );
      await refreshUsers();
    }
  };

  const handleToggleRole = async (userId: string) => {
    setOpenMenuId(null);
    try {
      const result = await toggleUserRole(userId);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((user) =>
            user.id === userId ? { ...user, role: result.role } : user
          ),
        };
      });
      toast.success(
        result.role === "admin" ? "User promoted to admin." : "User demoted."
      );
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to update user."
      );
    }
  };

  const handleDelete = async (userId: string, label: string) => {
    if (!confirm(`Delete ${label}?`)) {
      return;
    }
    setOpenMenuId(null);
    try {
      await deleteUser(userId);
      toast.success("User deleted.");
      await refreshUsers();
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to delete user."
      );
    }
  };

  const hasUsers = optimisticUsers.length > 0;
  const totalPages = data?.totalPages ?? 1;
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;
  const isBusy = loading || isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            User Management
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review and manage all registered users.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search users"
            className="h-11 w-64 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.25em] text-slate-400">
              <tr>
                <th className="py-3">User</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="py-3">Joined</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isBusy && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              )}

              {!isBusy && !hasUsers && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}

              {!isBusy &&
                optimisticUsers.map((user) => {
                  const isAdmin = user.role === "admin";
                  const isBanned = user.isBanned;
                  const isSelf = currentUserId === user.id;

                  return (
                    <tr key={user.id} className={isBanned ? "bg-red-50/40" : ""}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={getAvatarSource(user)}
                            alt={getDisplayName(user)}
                            width={44}
                            height={44}
                            className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              {getDisplayName(user)}
                              {isSelf ? " (You)" : ""}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isAdmin
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isBanned
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600"
                            }`}
                        >
                          {isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-4 text-right">
                        <div className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenMenuId((prev) =>
                                prev === user.id ? null : user.id
                              );
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            aria-haspopup="menu"
                            aria-expanded={openMenuId === user.id}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openMenuId === user.id && (
                            <div
                              className="absolute right-0 top-11 z-10 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleRole(user.id)}
                                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                              >
                                {isAdmin ? "Demote Admin" : "Promote Admin"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleBan(user.id)}
                                disabled={isSelf}
                                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${isSelf
                                    ? "cursor-not-allowed text-slate-300"
                                    : "text-slate-700 hover:bg-slate-100"
                                  }`}
                              >
                                {isBanned ? "Unban User" : "Ban User"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(user.id, getDisplayName(user))}
                                disabled={isSelf}
                                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${isSelf
                                    ? "cursor-not-allowed text-red-200"
                                    : "text-red-600 hover:bg-red-50"
                                  }`}
                              >
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Page {data?.page ?? currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canGoBack}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canGoForward}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
