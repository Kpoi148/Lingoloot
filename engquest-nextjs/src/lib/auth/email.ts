// Email helper for sending password reset and other auth-related messages.
import { PASSWORD_RESET_TOKEN_TTL_MINUTES } from "./password-reset";

type SendPasswordResetEmailInput = {
  to: string;
  name?: string | null;
  resetUrl: string;
};

type SendEmailResult = {
  ok: boolean;
  error?: string;
  preview?: boolean;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildResetEmailHtml = ({
  recipientName,
  resetUrl,
}: {
  recipientName: string;
  resetUrl: string;
}) => {
  const safeName = escapeHtml(recipientName);
  const safeUrl = escapeHtml(resetUrl);

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111827;">
      <p>Xin chao ${safeName},</p>
      <p>Ban vua yeu cau dat lai mat khau cho tai khoan LingoLoot.</p>
      <p>
        Link dat lai mat khau (hieu luc trong ${PASSWORD_RESET_TOKEN_TTL_MINUTES} phut):
        <a href="${safeUrl}">${safeUrl}</a>
      </p>
      <p>Neu ban khong thuc hien yeu cau nay, ban co the bo qua email nay.</p>
    </div>
  `;
};

const buildResetEmailText = ({
  recipientName,
  resetUrl,
}: {
  recipientName: string;
  resetUrl: string;
}) =>
  [
    `Xin chao ${recipientName},`,
    "",
    "Ban vua yeu cau dat lai mat khau cho tai khoan LingoLoot.",
    `Link dat lai mat khau (hieu luc trong ${PASSWORD_RESET_TOKEN_TTL_MINUTES} phut):`,
    resetUrl,
    "",
    "Neu ban khong thuc hien yeu cau nay, ban co the bo qua email nay.",
  ].join("\n");

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailInput): Promise<SendEmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress =
    process.env.MAIL_FROM?.trim() ?? "LingoLoot <onboarding@resend.dev>";
  const recipientName = name?.trim() || "ban";
  const subject = "Dat lai mat khau tai khoan LingoLoot";

  if (!resendApiKey) {
    const previewMessage = [
      "RESEND_API_KEY is not configured. Password reset email was not sent.",
      `Recipient: ${to}`,
      `Reset URL: ${resetUrl}`,
    ].join("\n");

    if (process.env.NODE_ENV !== "production") {
      console.warn(previewMessage);
      return { ok: true, preview: true };
    }

    return { ok: false, error: "Email service is not configured." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html: buildResetEmailHtml({ recipientName, resetUrl }),
        text: buildResetEmailText({ recipientName, resetUrl }),
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      return {
        ok: false,
        error: data.message || data.error || "Unable to send reset email.",
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to send reset email.",
    };
  }
}
