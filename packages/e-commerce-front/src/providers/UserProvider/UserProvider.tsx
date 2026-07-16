"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@e-commerce/api-client/schemas/auth";

interface UserContextType {
  user: UserProfile | null;
  userId: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  token: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { profile, userId, isLoadingProfile, isInitialized, token } = useAuth();

  return (
    <UserContext
      value={{
        user: profile,
        userId,
        isLoading: isLoadingProfile,
        isInitialized,
        token,
      }}
    >
      {children}
    </UserContext>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
