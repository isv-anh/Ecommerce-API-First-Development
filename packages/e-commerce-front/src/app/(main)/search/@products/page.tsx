import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductGridClient from "@/features/main/components/ProductList/ProductGridClient";
import { getQueryClient } from "@/utils/query";
import {
  searchProducts,
  getSearchProductsQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import { dehydrate } from "@tanstack/react-query";

interface ProductPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ProductPage = async ({ searchParams }: ProductPageProps) => {
  const resolvedSearchParams = await searchParams;
  // Fallback to simple object if parsing is complex, or use validation schema if available
  const parsedParams = resolvedSearchParams as any;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getSearchProductsQueryKey(parsedParams),
    queryFn: () => searchProducts(parsedParams),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <ProductGridClient />
    </Hydration>
  );
};

export default ProductPage;
