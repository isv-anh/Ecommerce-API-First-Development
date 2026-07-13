"use client";

import { useEffect } from "react";
import { bootstrapAuth } from "@/utils/authBootstrap";
import tokenStore from "@e-commerce/api-client/storages/token-storage";

export function AuthInitializer() {
  useEffect(() => {
    bootstrapAuth()
      .then((token) => {
        if (token) {
          tokenStore.setTokens(token);
        } else {
          tokenStore.setInitialized(true);
        }
      })
      .catch(() => {
        tokenStore.setInitialized(true);
      });
  }, []);

  return null;
}
