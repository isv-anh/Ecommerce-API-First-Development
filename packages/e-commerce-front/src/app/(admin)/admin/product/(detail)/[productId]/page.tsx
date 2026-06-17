import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import ProductDetail from "@/features/admin/product/detail/ProductDetail";

const ProductDetailPage = async ({
  params,
}: PageProps<"/admin/product/[productId]">) => {
  const { productId } = await params;
  return (
    <SuspenseWrapper>
      <ProductDetail productId={productId} />
    </SuspenseWrapper>
  );
};

export default ProductDetailPage;
