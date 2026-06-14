import ProductDetail from "@/features/admin/product/detail/ProductDetail";

const ProductDetailPage = async ({
  params,
}: PageProps<"/admin/product/[productId]">) => {
  const { productId } = await params;
  return <ProductDetail productId={productId} />;
};

export default ProductDetailPage;
