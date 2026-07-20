import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductGridClient from "@/features/main/components/ProductList/ProductGridClient";
import { getQueryClient } from "@/utils/query";
import {
  getUserProducts,
  getGetUserProductsQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import { dehydrate } from "@tanstack/react-query";
import { getUserProductsQueryParams } from "@e-commerce/api-validation/zod/product";

interface ProductPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ProductPage = async ({ searchParams }: ProductPageProps) => {
  const resolvedSearchParams = await searchParams;
  const parsedParams = getUserProductsQueryParams.parse(resolvedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetUserProductsQueryKey(parsedParams),
    queryFn: () => getUserProducts(parsedParams),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <ProductGridClient />
    </Hydration>
  );
};

export default ProductPage;
