"use server";

import { postLogin } from "@e-commerce/api-client/endpoints/auth";
import type { PostLoginBody } from "@e-commerce/api-validation/types/auth";
import { cookies } from "next/headers";

export async function login(body: PostLoginBody) {
  try {
    const data = await postLogin(body);

    const cookieStore = await cookies();

    cookieStore.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return data.accessToken;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
}
