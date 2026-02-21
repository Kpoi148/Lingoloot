import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string | string[];
  }>;
};

const parseToken = (value?: string | string[]) =>
  typeof value === "string" ? value : "";

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = parseToken(resolvedSearchParams?.token).trim();

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 px-4 py-16 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
