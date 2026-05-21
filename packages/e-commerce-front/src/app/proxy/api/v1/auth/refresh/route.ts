import { setAccessToken, setRefreshToken } from "@/utils/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

/**
 * Refresh authentication tokens through the Next.js BFF layer.
 *
 * Flow:
 * 1. Read refresh token from secure HTTP-only cookies.
 * 2. Forward refresh request to backend auth service.
 * 3. Receive new access token and refresh token pair.
 * 4. Update authentication cookies.
 * 5. Return 204 No Content on success.
 *
 * Security benefits:
 * - Refresh token never becomes accessible to browser JavaScript.
 * - Authentication logic stays server-side.
 * - Backend API remains hidden from the client.
 *
 * Notes:
 * - Returns 401 if refresh token cookie is missing.
 * - Backend auth errors are forwarded as-is.
 * - Unexpected runtime/network errors return 500.
 *
 * @returns NextResponse with updated auth cookies or error response.
 */
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
