// Source module for the src feature.
import { NextResponse, type NextRequest } from "next/server";
import { jwtDecrypt, jwtVerify } from "jose";

const authRoutes = ["/", "/login", "/register"];
const publicRoutes = ["/", "/about", "/forgot-password", "/reset-password"];

const SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
  "next-auth.session-token",
] as const;

const isRouteMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const getSessionToken = (req: NextRequest) => {
  const allCookies = req.cookies.getAll();
  for (const name of SESSION_COOKIE_NAMES) {
    const value = req.cookies.get(name)?.value;
    if (value) {
      return { value, cookieNamesToClear: [name] };
    }
    const chunked = allCookies
      .filter((cookie) => cookie.name.startsWith(`${name}.`))
      .sort((a, b) => {
        const aIndex = Number.parseInt(a.name.split(".").pop() ?? "0", 10);
        const bIndex = Number.parseInt(b.name.split(".").pop() ?? "0", 10);
        return aIndex - bIndex;
      });
    if (chunked.length > 0) {
      return {
        value: chunked.map((cookie) => cookie.value).join(""),
        cookieNamesToClear: chunked.map((cookie) => cookie.name),
      };
    }
  }
  return { value: null, cookieNamesToClear: [] };
};

const deriveEncryptionKey = async (secret: string) => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "HKDF",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: encoder.encode("NextAuth.js Generated Encryption Key"),
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
};

const verifyToken = async (token: string | null, secret: string | undefined) => {
  if (!token || !secret) return false;
  try {
    const encodedSecret = new TextEncoder().encode(secret);
    const tokenParts = token.split(".");
    if (tokenParts.length === 5) {
      const encryptionKey = await deriveEncryptionKey(secret);
      await jwtDecrypt(token, encryptionKey);
      return true;
    }
    await jwtVerify(token, encodedSecret);
    return true;
  } catch {
    return false;
  }
};

const clearSessionCookie = (response: NextResponse, cookieName: string) => {
  response.cookies.set(cookieName, "", { path: "/", expires: new Date(0) });
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = isRouteMatch(pathname, publicRoutes);
  const isAuthRoute = isRouteMatch(pathname, authRoutes);
  const requiresAuth = !isPublicRoute && !isAuthRoute;

  const { value: sessionToken, cookieNamesToClear } = getSessionToken(req);
  const jwtSecret = process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET;
  const isAuthenticated = await verifyToken(sessionToken, jwtSecret);
  const hasInvalidToken = Boolean(
    sessionToken && !isAuthenticated && cookieNamesToClear.length > 0
  );

  if (!isAuthenticated && requiresAuth) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(redirectUrl);
    if (hasInvalidToken) {
      cookieNamesToClear.forEach((cookieName) =>
        clearSessionCookie(response, cookieName)
      );
    }
    return response;
  }

  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/profile";
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  if (hasInvalidToken) {
    cookieNamesToClear.forEach((cookieName) =>
      clearSessionCookie(response, cookieName)
    );
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:css|js|json|map|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
