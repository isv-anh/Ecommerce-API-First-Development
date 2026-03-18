import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductList from "@/features/main/components/ProductList/ProductList";
import { getListProductsSuspenseQueryOptions } from "@/generated/endpoints/petstore/petstore";
import { getQueryClient } from "@/utils/query";
import { dehydrate } from "@tanstack/react-query";

const ProductPage = () => {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    ...getListProductsSuspenseQueryOptions(),
  });

  return (
    <Hydration state={dehydrate(queryClient)}>
      <ProductList />
    </Hydration>
  );
};

export default ProductPage;
