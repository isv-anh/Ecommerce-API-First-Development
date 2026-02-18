"use client";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactNode, useEffect, useState } from "react";

const MockBrowser = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);

  const enableMocking = async () => {
    const { worker } = await import("@/mock/browser");

    return worker.start();
  };

  useEffect(() => {
    enableMocking().then(() => {
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Backdrop open={loading}>
      <CircularProgress />
    </Backdrop>
  ) : (
    children
  );
};

export default MockBrowser;
