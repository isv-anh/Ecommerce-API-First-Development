"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import tokenStore from "@e-commerce/api-client/storages/token-storage";
import { getProfile, getGetProfileQueryKey } from "@e-commerce/api-client/endpoints/auth";

/**
 * Hook custom để sử dụng thông tin xác thực một cách reactive trong các React components.
 * Sử dụng `useSyncExternalStore` (React 18+) để đồng bộ hóa và lắng nghe trạng thái của `tokenStore`
 * (một in-memory vanilla store nằm ngoài luồng quản lý của React).
 *
 * Kết hợp với React Query `useQuery` để tải thông tin profile người dùng khi token khả dụng.
 */
export function useAuth() {
  // Lắng nghe và đồng bộ hóa access token từ store
  const token = useSyncExternalStore(
    (onStoreChange) => tokenStore.subscribe(onStoreChange),
    () => tokenStore.getAccessToken(),
    () => null
  );

  // Lắng nghe cờ khởi tạo từ store
  const isInitialized = useSyncExternalStore(
    (onStoreChange) => tokenStore.subscribe(onStoreChange),
    () => tokenStore.isInitialized(),
    () => false
  );

  // Truy vấn lấy dữ liệu profile bằng React Query khi đã có token
  const { data: profile, isFetching: isLoadingProfile } = useQuery({
    queryKey: getGetProfileQueryKey(),
    queryFn: () => getProfile(),
    enabled: !!token && typeof window !== "undefined",
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 5 minutes
    staleTime: 5 * 60 * 1000, // Cấu hình cache 5 phút
  });

  return {
    token,
    userId: profile?.id || null,
    profile: profile || null,
    isInitialized,
    isLoadingProfile: !!token && isLoadingProfile,
  };
}
