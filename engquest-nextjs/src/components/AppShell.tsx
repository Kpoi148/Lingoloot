"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAdminRoute = pathname?.startsWith("/admin");
  const hideNavbarRoutes = ["/", "/login", "/register"];
  const isAuthPage = pathname ? hideNavbarRoutes.includes(pathname) : false;
  const isAuthenticated = status === "authenticated";
  const userName =
    session?.user?.displayName ||
    session?.user?.name ||
    session?.user?.email ||
    "Người dùng";
  const userAvatarUrl = session?.user?.avatarUrl || session?.user?.image;

  return (
    <>
      {!isAdminRoute && !isAuthPage && isAuthenticated && (
        <Navbar userName={userName} userAvatarUrl={userAvatarUrl} />
      )}
      {children}
    </>
  );
}
