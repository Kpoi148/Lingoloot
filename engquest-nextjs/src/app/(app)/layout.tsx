import AppShell from "@/components/AppShell";
import Providers from "@/components/Providers";

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
