import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function Hydration({
  state,
  children,
}: {
  state: DehydratedState;
  children: ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
