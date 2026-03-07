"use client";
// Controller hook that coordinates admin user list state, filters, and mutations.

import { useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  deleteUser,
  getUsers,
  toggleUserBan,
  toggleUserRole,
  type UserFilters,
  type UserListItem,
  type UsersPageResult,
} from "@/actions/admin/user.actions";

const EMPTY_FILTERS: UserFilters = {
  search: "",
  name: "",
  email: "",
  role: "",
  status: "",
};

type OptimisticAction = {
  type: "ban";
  userId: string;
};

type UseAdminUsersControllerOptions = {
  initialData: UsersPageResult | null;
  initialError: string | null;
  initialFilters: UserFilters;
  initialPage: number;
};

const areFiltersEqual = (left: UserFilters, right: UserFilters) =>
  (left.search ?? "") === (right.search ?? "") &&
  (left.name ?? "") === (right.name ?? "") &&
  (left.email ?? "") === (right.email ?? "") &&
  (left.role ?? "") === (right.role ?? "") &&
  (left.status ?? "") === (right.status ?? "");

export function useAdminUsersController({
  initialData,
  initialError,
  initialFilters,
  initialPage,
}: UseAdminUsersControllerOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<UsersPageResult | null>(initialData);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(!initialData);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [isPending, startTransition] = useTransition();
  const initialLoadRef = useRef(true);

  const queryParam = searchParams.get("q") ?? "";
  const nameParam = searchParams.get("name") ?? "";
  const emailParam = searchParams.get("email") ?? "";
  const roleParam = searchParams.get("role") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const pageParam = searchParams.get("page") ?? "1";

  const parsedPage = Number.parseInt(pageParam, 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const searchParamsString = searchParams.toString();

  const currentFilters = useMemo(
    () => ({
      search: queryParam,
      name: nameParam,
      email: emailParam,
      role: roleParam,
      status: statusParam,
    }),
    [queryParam, nameParam, emailParam, roleParam, statusParam]
  );

  const users = data?.users ?? [];

  const [optimisticUsers, updateOptimisticUsers] = useOptimistic(
    users,
    (state: UserListItem[], action: OptimisticAction) => {
      if (action.type !== "ban") {
        return state;
      }

      return state.map((user) =>
        user.id === action.userId
          ? { ...user, isBanned: !user.isBanned }
          : user
      );
    }
  );

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);

      if (filters.search) params.set("q", filters.search); else params.delete("q");
      if (filters.name) params.set("name", filters.name); else params.delete("name");
      if (filters.email) params.set("email", filters.email); else params.delete("email");
      if (filters.role) params.set("role", filters.role); else params.delete("role");
      if (filters.status) params.set("status", filters.status); else params.delete("status");

      if (!areFiltersEqual(filters, currentFilters)) {
        params.set("page", "1");
        router.replace(`?${params.toString()}`);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [filters, currentFilters, router, searchParamsString]);

  useEffect(() => {
    let active = true;

    const shouldSkipInitial =
      initialLoadRef.current &&
      initialData &&
      areFiltersEqual(currentFilters, initialFilters) &&
      currentPage === initialPage;

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
    }

    if (shouldSkipInitial) {
      return undefined;
    }

    startTransition(() => {
      setLoading(true);
      getUsers(currentFilters, currentPage)
        .then((result) => {
          if (!active) {
            return;
          }

          setData(result);
          setError(null);

          if (result.page !== currentPage) {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(result.page));
            router.replace(`?${params.toString()}`);
          }
        })
        .catch((fetchError) => {
          if (!active) {
            return;
          }

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
    currentFilters,
    currentPage,
    initialData,
    initialFilters,
    initialPage,
    router,
    startTransition,
  ]);

  useEffect(() => {
    if (!openMenuId) {
      return undefined;
    }

    const handleClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [openMenuId]);

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParamsString);
    params.set("page", String(nextPage));
    router.push(`?${params.toString()}`);
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsers(currentFilters, currentPage);
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
        if (!prev) {
          return prev;
        }

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
        if (!prev) {
          return prev;
        }

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

  return {
    canGoBack,
    canGoForward,
    currentPage,
    data,
    editingUser,
    error,
    filters,
    handleDelete,
    handlePageChange,
    handleToggleBan,
    handleToggleRole,
    hasUsers,
    isBusy,
    openMenuId,
    optimisticUsers,
    refreshUsers,
    setEditingUser,
    setFilters,
    setOpenMenuId,
    totalPages,
    clearFilters: () => setFilters(EMPTY_FILTERS),
  };
}
