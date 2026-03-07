// Shared API auth guards for learner and admin protected route handlers.
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

type SessionUser = {
  id: string;
  role?: string;
};

export type ApiAuthSuccess = {
  ok: true;
  session: Session & { user: SessionUser };
};

export type ApiAuthFailure = {
  ok: false;
  status: 401 | 403;
  message: string;
};

export type ApiAuthResult = ApiAuthSuccess | ApiAuthFailure;

export async function requireUserApiSession(): Promise<ApiAuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized.",
    };
  }

  return {
    ok: true,
    session: session as Session & { user: SessionUser },
  };
}

export async function requireAdminApiSession(): Promise<ApiAuthResult> {
  const auth = await requireUserApiSession();

  if (!auth.ok) {
    return auth;
  }

  if (auth.session.user.role !== "admin") {
    return {
      ok: false,
      status: 403,
      message: "Forbidden.",
    };
  }

  return auth;
}
