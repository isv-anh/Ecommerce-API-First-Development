"use client";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type LoadingFallbackProps = {
  width?: number;
  height?: number;
};

const defaultHeight = 200;

const LoadingFallback = ({
  width,
  height = defaultHeight,
}: LoadingFallbackProps) => {
  return <Skeleton variant="rectangular" width={width} height={height} />;
};

const SuspenseWrapper = ({
  children,
  width,
  height,
}: { children: ReactNode } & LoadingFallbackProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              There was an error!
              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
            </div>
          )}
        >
          <Suspense
            fallback={<LoadingFallback width={width} height={height} />}
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default SuspenseWrapper;
