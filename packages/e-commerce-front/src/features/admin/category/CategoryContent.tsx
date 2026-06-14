// Demo cho ssr dùng sau này (category là admin page nên việc ssr là không cần thiết)
import Hydration from "@/components/ssr/Hydration/Hydration";
import CategoryGrid from "@/features/admin/category/components/CategoryGrid/CategoryGrid";
import { parseSearchParams } from "@/providers/SearchProvider/utils";
import { getQueryClient } from "@/utils/query";
import {
  getCategories,
  getGetCategoriesQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import { getCategoriesQueryParams } from "@e-commerce/api-validation/zod/product";
import { dehydrate } from "@tanstack/react-query";

const CategoryContent = async ({
  searchParams,
}: PageProps<"/admin/category">) => {
  const queryClient = getQueryClient();

  const rawParams = await searchParams;

  const params = parseSearchParams(
    new URLSearchParams(rawParams as Record<string, string>),
    getCategoriesQueryParams,
  );

  await queryClient.prefetchQuery({
    queryKey: getGetCategoriesQueryKey(params),
    queryFn: () => getCategories(params),
  });
  return (
    <Hydration state={dehydrate(queryClient)}>
      <CategoryGrid />
    </Hydration>
  );
};

export default CategoryContent;
