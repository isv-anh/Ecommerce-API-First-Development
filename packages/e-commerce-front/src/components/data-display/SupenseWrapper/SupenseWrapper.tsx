"use client";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type LoadingFallbackProps = {
  width?: number;
  height?: number;
};

const LoadingFallback = ({ width, height }: LoadingFallbackProps) => {
  return <Skeleton width={width} height={height} />;
};

const SupenseWrapper = ({
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

export default SupenseWrapper;
