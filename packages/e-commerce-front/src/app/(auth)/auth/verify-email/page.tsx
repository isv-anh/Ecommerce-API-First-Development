import React, { Suspense } from "react";
import VerifyEmail from "@/components/auth/VerifyEmail/VerifyEmail";
import { Box, CircularProgress } from "@mui/material";

export default function Page() {
  return (
    <Suspense fallback={<Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>}>
      <VerifyEmail />
    </Suspense>
  );
}
