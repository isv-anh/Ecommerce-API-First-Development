import ProductDetail from "@/features/main/product/ProductDetail";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import Hydration from "@/components/ssr/Hydration/Hydration";
import { getQueryClient } from "@/utils/query";
import { dehydrate } from "@tanstack/react-query";
import {
  getProductBySlug,
  getGetProductBySlugQueryKey,
} from "@e-commerce/api-client/endpoints/product";

const ProductDetailPage = async ({ params }: PageProps<"/product/[slug]">) => {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: getGetProductBySlugQueryKey(slug),
      queryFn: () => getProductBySlug(slug),
    });
  } catch (error) {
    console.error("Failed to prefetch product data:", error);
  }

  return (
    <Hydration state={dehydrate(queryClient)}>
      <SuspenseWrapper>
        <ProductDetail slug={slug} />
      </SuspenseWrapper>
    </Hydration>
  );
};

export default ProductDetailPage;
