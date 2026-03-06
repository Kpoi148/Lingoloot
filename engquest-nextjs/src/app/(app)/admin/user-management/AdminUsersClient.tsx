"use client";

import EditUserModal from "@/components/admin/users/EditUserModal";
import AdminUsersFilters from "@/components/admin/users/AdminUsersFilters";
import AdminUsersPagination from "@/components/admin/users/AdminUsersPagination";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import {
  type UserFilters,
  type UsersPageResult,
} from "@/actions/admin/user.actions";
import { useAdminUsersController } from "@/components/admin/users/useAdminUsersController";
import type { ShopVisualItem } from "@/types/shop-item";

type AdminUsersClientProps = {
  initialData: UsersPageResult | null;
  initialError?: string | null;
  initialFilters: UserFilters;
  initialPage: number;
  currentUserId?: string;
  shopItems?: ShopVisualItem[];
};

export default function AdminUsersClient({
  initialData,
  initialError = null,
  initialFilters,
  initialPage,
  currentUserId,
  shopItems = [],
}: AdminUsersClientProps) {
  const {
    canGoBack,
    canGoForward,
    clearFilters,
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
  } = useAdminUsersController({
    initialData,
    initialError,
    initialFilters,
    initialPage,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            User Management
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Review and manage all registered users.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-900/20">
        <AdminUsersFilters
          filters={filters}
          setFilters={setFilters}
          onClear={clearFilters}
        />

        <AdminUsersTable
          users={optimisticUsers}
          isBusy={isBusy}
          hasUsers={hasUsers}
          currentUserId={currentUserId}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          shopItems={shopItems}
          onEdit={setEditingUser}
          onToggleRole={handleToggleRole}
          onToggleBan={handleToggleBan}
          onDelete={handleDelete}
        />

        <AdminUsersPagination
          currentPage={data?.page ?? currentPage}
          totalPages={totalPages}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onPageChange={handlePageChange}
        />
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={refreshUsers}
        />
      )}
    </div>
  );
}
