// Authenticated app layout that wraps learner and admin routes with shared shell.
import AppShell from "@/components/layout/AppShell";
import Providers from "@/components/providers/Providers";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
