import "server-only";
import { NextResponse } from "next/server";

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
