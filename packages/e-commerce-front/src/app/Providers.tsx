"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import { getQueryClient } from "@/utils/query";
import BreadcrumbsProvider from "@/components/navigation/Breadcrumbs/components/BreadcrumbsProvider/BreadcrumbsProvider";
import dynamic from "next/dynamic";

const ReactQueryDevtools = dynamic(
  async () =>
    (await import("@tanstack/react-query-devtools"))
      .ReactQueryDevtools,
  { ssr: false },
);

const MockBrowser = dynamic(() => import("@/app/MockBrowser"), {
  ssr: false,
});


const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => getQueryClient());

  const content = (
    <BreadcrumbsProvider>{children}</BreadcrumbsProvider>
  );

  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {process.env.ENABLE_MOCKS === "true" ? (
            <MockBrowser>{content}</MockBrowser>
          ) : (
            content
          )}

          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
