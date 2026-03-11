import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductList from "@/features/main/components/ProductList/ProductList";
import { getListProductsSuspenseQueryOptions } from "@/generated/endpoints/petstore/petstore";
import { dehydrate, QueryClient } from "@tanstack/react-query";

const ProductPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...getListProductsSuspenseQueryOptions(),
  });
  return (
    <Hydration state={dehydrate(queryClient)}>
      <ProductList />
    </Hydration>
  );
};

export default ProductPage;
