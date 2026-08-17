"use client";
// Filter controls for narrowing the admin user list by search and status.

import type { Dispatch, SetStateAction } from "react";
import type { UserFilters } from "@/actions/admin/user.actions";

type AdminUsersFiltersProps = {
  filters: UserFilters;
  setFilters: Dispatch<SetStateAction<UserFilters>>;
  onClear: () => void;
};

export default function AdminUsersFilters({
  filters,
  setFilters,
  onClear,
}: AdminUsersFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
        <input
          value={filters.search ?? ""}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, search: event.target.value }))
          }
          placeholder="Search users..."
          className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600 md:w-64"
        />
        <div className="flex w-full flex-1 gap-2 md:w-auto">
          <select
            value={filters.role ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, role: event.target.value }))
            }
            className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600 md:flex-initial md:px-4"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value }))
            }
            className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-slate-600 md:flex-initial md:px-4"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
      >
        Clear Filters
      </button>
    </div>
  );
}
