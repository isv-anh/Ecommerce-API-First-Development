import FeaturedCategories from "@/features/main/home/components/FeaturedCategories/FeaturedCategories";
import Hydration from "@/components/ssr/Hydration/Hydration";
import { getQueryClient } from "@/utils/query";
import { dehydrate } from "@tanstack/react-query";
import { getAllRootCategories, getGetAllRootCategoriesQueryKey } from "@e-commerce/api-client/endpoints/product";

export default async function CategorySlot() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetAllRootCategoriesQueryKey(),
    queryFn: () => getAllRootCategories(),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <FeaturedCategories />
    </Hydration>
  );
}
