// Guest page for requesting a password reset email.
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 px-4 py-16 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
