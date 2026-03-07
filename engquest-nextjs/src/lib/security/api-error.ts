// Shared API error formatter that hides internals behind stable client responses.
import { NextResponse } from "next/server";

type ErrorResponseOptions = {
  error: unknown;
  scope: string;
  publicMessage: string;
  status?: number;
  field?: "message" | "error";
};

export const createApiErrorResponse = ({
  error,
  scope,
  publicMessage,
  status = 500,
  field = "message",
}: ErrorResponseOptions) => {
  console.error(`[${scope}]`, error);
  return NextResponse.json({ [field]: publicMessage }, { status });
};
