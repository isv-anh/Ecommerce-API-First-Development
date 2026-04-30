const ProductDetailPage = async ({
  params,
}: PageProps<"/product/[productId]">) => {
  const { productId } = await params;
  return <div>Product Detail Page: {productId}</div>;
};

export default ProductDetailPage;
