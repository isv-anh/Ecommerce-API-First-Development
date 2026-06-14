// import Hydration from "@/components/ssr/Hydration/Hydration";
import ProductList from "@/features/main/components/ProductList/ProductList";
// import { getQueryClient } from "@/utils/query";
// import { getGetProductsSuspenseQueryOptions } from "@e-commerce/api-client/endpoints/product";

// import { dehydrate } from "@tanstack/react-query";

const ProductPage = () => {
  // const queryClient = getQueryClient();

  // queryClient.prefetchQuery({
  //   ...getGetProductsSuspenseQueryOptions(),
  // });

  return (
    // <Hydration state={dehydrate(queryClient)}>
    <ProductList />
    // </Hydration>
  );
};

export default ProductPage;
