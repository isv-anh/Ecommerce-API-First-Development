import Hydration from "@/components/ssr/Hydration/Hydration";
import { getQueryClient } from "@/utils/query";
import {
  getBrands,
  getGetBrandsQueryKey,
  getCategories,
  getGetCategoriesQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import { dehydrate } from "@tanstack/react-query";
import ProductSearchClient from "@/features/main/components/ProductList/ProductSearchClient";

const ProductSearchPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getGetBrandsQueryKey(),
      queryFn: () => getBrands(),
    }),
    queryClient.prefetchQuery({
      queryKey: getGetCategoriesQueryKey(),
      queryFn: () => getCategories(),
    }),
  ]);

  return (
    <Hydration state={dehydrate(queryClient)}>
      <ProductSearchClient />
    </Hydration>
  );
};

export default ProductSearchPage;
