import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

export default function Hydration({
  state,
  children,
}: {
  state: DehydratedState;
  children: React.ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
