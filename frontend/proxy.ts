
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === "/login";

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // No tokens: allow login page, protect admin pages.
  if (!accessToken && !refreshToken) {
    return isLoginPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));
  }

  // Access token exists: verify it.
  if (accessToken) {
    try {
      const secret = process.env.ACCESS_TOKEN;

      if (!secret) {
        throw new Error("ACCESS_TOKEN secret is missing");
      }

      await jwtVerify(
        accessToken,
        new TextEncoder().encode(secret)
      );

      // Valid session: don't show login page again.
      return isLoginPage
        ? NextResponse.redirect(new URL("/admin", req.url))
        : NextResponse.next();

    } catch {
      // Invalid or expired access token.
      // Try refreshing if refresh token exists.
      if (!refreshToken) {
        return isLoginPage
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  // Access token missing/invalid, but refresh token exists.
  return refreshAccessToken(req, isLoginPage);
};

async function refreshAccessToken(
  req: NextRequest,
  redirectToAdmin: boolean
) {
  const refreshRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
    {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  if (!refreshRes.ok) {
    const response = redirectToAdmin
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }

  const response = redirectToAdmin
    ? NextResponse.redirect(new URL("/admin", req.url))
    : NextResponse.next();

  // Forward all cookies issued by the backend.
  for (const cookie of refreshRes.headers.getSetCookie()) {
    response.headers.append("Set-Cookie", cookie);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
