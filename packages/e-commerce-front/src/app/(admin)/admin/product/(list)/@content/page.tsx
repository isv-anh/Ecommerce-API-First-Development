import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import ProductGrid from "@/features/admin/product/list/components/ProductGrid/ProductGrid";

const ProductGridPage = () => {
  return (
    <SuspenseWrapper height={350}>
      <ProductGrid />
    </SuspenseWrapper>
  );
};

export default ProductGridPage;
