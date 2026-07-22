"use server";

import { postVerifyEmail, postResendVerification } from "@e-commerce/api-client/endpoints/auth";
import type { PostVerifyEmailBody, PostResendVerificationBody } from "@e-commerce/api-validation/types/auth";

import { cookies } from "next/headers";

export async function verifyEmailAction(body: PostVerifyEmailBody) {
  try {
    const data = await postVerifyEmail(body);

    const cookieStore = await cookies();

    cookieStore.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, accessToken: data.accessToken };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Xác thực thất bại",
    };
  }
}

export async function resendVerificationAction(body: PostResendVerificationBody) {
  try {
    const data = await postResendVerification(body);
    return { success: true, message: data.message };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Gửi lại OTP thất bại",
    };
  }
}
