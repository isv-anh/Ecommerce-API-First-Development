import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const targetUrl = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;

  // Forward headers
  const forwardHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (
      !["host", "connection", "transfer-encoding", "content-length"].includes(
        key,
      )
    ) {
      forwardHeaders[key] = value;
    }
  });

  if (accessToken) {
    forwardHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const isBodyless = req.method === "GET" || req.method === "HEAD";

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: isBodyless ? undefined : await req.arrayBuffer(),
    });

    // Forward response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Proxy Error]", targetUrl, error);
    return NextResponse.json({ message: "Proxy error" }, { status: 502 });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
