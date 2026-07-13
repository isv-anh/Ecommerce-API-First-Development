"use client";

import { useAuth } from "@/hooks/useAuth";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { type ReactNode } from "react";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return children;
}
