"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthenticated = status === "authenticated";
  const userName =
    session?.user?.name || session?.user?.email || "Người dùng";

  return (
    <>
      {!isAdminRoute && isAuthenticated && <Navbar userName={userName} />}
      {children}
    </>
  );
}
