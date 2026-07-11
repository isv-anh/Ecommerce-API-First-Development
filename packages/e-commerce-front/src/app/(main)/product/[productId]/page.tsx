import ProductDetail from "@/features/main/product/ProductDetail";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";

const ProductDetailPage = async ({
  params,
}: PageProps<"/product/[productId]">) => {
  const { productId } = await params;
  return (
    <SuspenseWrapper>
      <ProductDetail productId={productId} />
    </SuspenseWrapper>
  );
};

export default ProductDetailPage;
