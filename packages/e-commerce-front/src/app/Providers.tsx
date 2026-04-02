"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import { getQueryClient } from "@/utils/query";
import MockBrowser from "@/app/MockBrowser";

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => getQueryClient());
  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MockBrowser>{children}</MockBrowser>
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
