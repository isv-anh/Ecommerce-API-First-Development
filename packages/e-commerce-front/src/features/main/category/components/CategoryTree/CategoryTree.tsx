import { getCategoryTreeData } from "@/features/main/category/components/CategoryTree/utils";
import { useGetCategoriesSuspense } from "@e-commerce/api-client/endpoints/product/product";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useParams } from "next/navigation";

const CategoryTree = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryQuery = useGetCategoriesSuspense();
  const categories = categoryQuery.data.categories;
  return (
    <Box
      sx={{
        minWidth: 200,
        maxWidth: 400,
      }}
    >
      <RichTreeView
        items={getCategoryTreeData(categories)}
        selectedItems={categoryId}
      />
    </Box>
  );
};

export default CategoryTree;
