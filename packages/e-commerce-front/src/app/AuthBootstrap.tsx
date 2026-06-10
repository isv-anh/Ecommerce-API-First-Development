"use client";

import { bootstrapAuth } from "@/utils/authBootstrap";
import tokenStore from "@e-commerce/api-client/storages/token-storage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { type ReactNode, useEffect, useState } from "react";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapAuth()
      .then((data) => tokenStore.setTokens(data))
      .finally(() => {
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <Backdrop open={true}>
        <CircularProgress />
      </Backdrop>
    );
  }

  return children;
}
