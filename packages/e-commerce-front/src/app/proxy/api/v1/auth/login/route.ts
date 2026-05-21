import { setAccessToken, setRefreshToken } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

/**
 * Proxy login endpoint for the Next.js BFF layer.
 *
 * Flow:
 * 1. Receive login credentials from the client.
 * 2. Forward credentials to the backend auth service.
 * 3. Store access token and refresh token in secure HTTP-only cookies.
 * 4. Return 204 No Content on success.
 *
 * Notes:
 * - Tokens are never exposed to the browser JavaScript runtime.
 * - Backend validation errors are forwarded as-is.
 * - Unexpected errors return a generic 500 response.
 *
 * @param req Incoming Next.js request containing login credentials.
 * @returns NextResponse with auth cookies or error payload.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
