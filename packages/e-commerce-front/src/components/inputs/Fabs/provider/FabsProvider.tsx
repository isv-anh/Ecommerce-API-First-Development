import type {
  FabsContextType,
  FabType,
} from "@/components/inputs/Fabs/provider/types";
import type { ReactNode } from "react";
import { createContext, useCallback, useMemo, useState } from "react";

export const FabsContext = createContext<FabsContextType | undefined>(
  undefined,
);

const FabsProvider = ({ children }: { children: ReactNode }) => {
  const [fabs, setFabs] = useState<FabType[]>([]);

  const clear = useCallback(() => setFabs([]), []);

  const value = useMemo(() => ({ fabs, setFabs, clear }), [fabs, clear]);

  return <FabsContext value={value}>{children}</FabsContext>;
};

export default FabsProvider;
