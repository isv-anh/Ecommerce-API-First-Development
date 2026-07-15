import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import type { ReactNode } from "react";
import { getQueryClient } from "@/utils/query";
import { getCategories, getGetCategoriesQueryKey } from "@e-commerce/api-client/endpoints/product";
import { dehydrate } from "@tanstack/react-query";
import Hydration from "@/components/ssr/Hydration/Hydration";

const Layout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetCategoriesQueryKey(undefined),
    queryFn: () => getCategories(undefined),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <MainLayout>{children}</MainLayout>
    </Hydration>
  );
};

export default Layout;
