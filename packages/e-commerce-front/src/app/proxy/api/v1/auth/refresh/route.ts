import { setAccessToken, setRefreshToken } from "@/utils/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token not found",
        },
        {
          status: 401,
        },
      );
    }

    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();

      return NextResponse.json(error, {
        status: response.status,
      });
    }

    const data = await response.json();

    const res = new NextResponse(null, {
      status: 204,
    });

    setAccessToken(data.accessToken, res);

    setRefreshToken(data.refreshToken, res);

    return res;
  } catch {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
