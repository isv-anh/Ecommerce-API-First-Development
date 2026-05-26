import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import CategoryGrid from "@/features/admin/category/components/CategoryGrid/CategoryGrid";

const CategoryListContent = () => {
  return (
    <SuspenseWrapper height={400}>
      <CategoryGrid />
    </SuspenseWrapper>
  );
};

export default CategoryListContent;
