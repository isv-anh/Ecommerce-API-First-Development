import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import BrandGrid from "@/features/admin/brand/components/BrandGrid/BrandGrid";

const BrandListContent = () => {
  return (
    <SuspenseWrapper height={350}>
      <BrandGrid />
    </SuspenseWrapper>
  );
};

export default BrandListContent;