import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions/admin/user.actions";
import { getAdminShopItems } from "@/actions/admin/shop.actions";
import { authOptions } from "@/lib/auth-options";
import AdminUsersClient from "./AdminUsersClient";

export const dynamic = "force-dynamic";

type AdminUsersPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    name?: string | string[];
    email?: string | string[];
    role?: string | string[];
    status?: string | string[];
    page?: string | string[];
  }>;
};

const parseQueryValue = (value?: string | string[]) =>
  typeof value === "string" ? value : "";

const parsePageValue = (value?: string | string[]) => {
  if (typeof value !== "string") return 1;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  // Map legacy name/email params to general search 'q' if 'q' is missing
  let query = parseQueryValue(resolvedSearchParams?.q);
  if (!query) {
    query =
      parseQueryValue(resolvedSearchParams?.name) ||
      parseQueryValue(resolvedSearchParams?.email);
  }

  const role = parseQueryValue(resolvedSearchParams?.role);
  const status = parseQueryValue(resolvedSearchParams?.status);
  const page = parsePageValue(resolvedSearchParams?.page);

  // We intentionally leave name/email empty to enforce unified search behavior
  const filters = { search: query, name: "", email: "", role, status };

  let initialData = null;
  let initialError: string | null = null;

  try {
    initialData = await getUsers(filters, page);
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "Unable to load users.";
  }

  const shopItems = await getAdminShopItems();

  return (
    <AdminUsersClient
      initialData={initialData}
      initialError={initialError}
      initialFilters={filters}
      initialPage={page}
      currentUserId={session.user.id}
      shopItems={shopItems}
    />
  );
}
