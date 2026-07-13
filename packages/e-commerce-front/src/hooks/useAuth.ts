"use client";

import { useSyncExternalStore } from "react";
import tokenStore from "@e-commerce/api-client/storages/token-storage";

/**
 * Hook custom để sử dụng thông tin xác thực một cách reactive trong các React components.
 * Sử dụng `useSyncExternalStore` (React 18+) để đồng bộ hóa và lắng nghe trạng thái của `tokenStore`
 * (một in-memory vanilla store nằm ngoài luồng quản lý của React).
 *
 * Nhờ cơ chế này:
 * - Khi `tokenStore` cập nhật (đăng nhập, đăng xuất, tự động refresh), giao diện của React tự động cập nhật theo.
 * - Tránh được các lỗi warning về setState lồng nhau trong useEffect khi mount.
 * - Hỗ trợ đầy đủ SSR/SEO nhờ truyền giá trị server mặc định làm tham số thứ 3.
 */
export function useAuth() {
  // Lắng nghe và đồng bộ hóa access token
  const token = useSyncExternalStore(
    // 1. Đăng ký hàm lắng nghe sự thay đổi từ store
    (onStoreChange) => tokenStore.subscribe(onStoreChange),
    // 2. Hàm lấy giá trị hiện tại ở phía client
    () => tokenStore.getAccessToken(),
    // 3. Giá trị mặc định trả về khi kết xuất ở phía server (SSR) để tránh Hydration Mismatch
    () => null
  );

  // Lắng nghe và đồng bộ hóa cờ initialized (đã nạp xong token từ API hay chưa)
  const isInitialized = useSyncExternalStore(
    (onStoreChange) => tokenStore.subscribe(onStoreChange),
    () => tokenStore.isInitialized(),
    () => false
  );

  /**
   * Giải mã UserId (subject) từ JWT payload
   */
  const getUserId = () => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.sub || null;
    } catch {
      return null;
    }
  };

  return {
    token,
    userId: getUserId(),
    isInitialized,
  };
}
