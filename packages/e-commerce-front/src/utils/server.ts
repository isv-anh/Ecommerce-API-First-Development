import "server-only";
import { NextResponse } from "next/server";

/**
 * Store access token in a secure HTTP-only cookie.
 *
 * Cookie configuration:
 * - httpOnly:
 *   Prevents client-side JavaScript access.
 *
 * - secure:
 *   Ensures cookies are only sent over HTTPS in production.
 *
 * - sameSite=lax:
 *   Helps mitigate CSRF while still allowing normal navigation.
 *
 * - path=/:
 *   Makes cookie available across the entire application.
 *
 * - maxAge=15 minutes:
 *   Short-lived access token for improved security.
 *
 * @param accessToken JWT access token issued by backend auth service.
 * @param res Outgoing Next.js response object.
 */
export const setAccessToken = (accessToken: string, res: NextResponse) => {
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 15 minutes
    maxAge: 60 * 15,
  });
};

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
