import { setAccessToken, setRefreshToken } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

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
