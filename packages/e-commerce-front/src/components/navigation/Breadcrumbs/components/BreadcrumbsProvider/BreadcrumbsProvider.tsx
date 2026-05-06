import {
  Breadcrumb,
  BreadcrumbsContextType,
} from "@/components/navigation/Breadcrumbs/components/BreadcrumbsProvider/types";
import { createContext, ReactNode, useState } from "react";

export const BreadcrumbsContext = createContext<
  BreadcrumbsContextType | undefined
>(undefined);

const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  return (
    <BreadcrumbsContext
      value={{
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbsContext>
  );
};

export default BreadcrumbsProvider;
