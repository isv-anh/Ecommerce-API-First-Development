import "server-only";
import type { NextResponse } from "next/server";

/**
 * Store refresh token in a secure HTTP-only cookie.
 *
 * Cookie configuration:
 * - httpOnly:
 *   Prevents client-side JavaScript access.
 *
 * - secure:
 *   Ensures cookies are only sent over HTTPS in production.
 *
 * - sameSite=lax:
 *   Helps mitigate CSRF attacks.
 *
 * - path=/:
 *   Makes cookie available application-wide.
 *
 * - maxAge=7 days:
 *   Longer lifespan to support silent authentication refresh.
 *
 * @param refreshToken JWT refresh token issued by backend auth service.
 * @param res Outgoing Next.js response object.
 */
export const setRefreshToken = (refreshToken: string, res: NextResponse) => {
  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 7 days
    maxAge: 60 * 60 * 24 * 7,
  });
};
