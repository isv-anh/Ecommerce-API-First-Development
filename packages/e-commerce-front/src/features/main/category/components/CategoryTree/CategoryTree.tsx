import { getCategoryTreeData } from "@/features/main/category/components/CategoryTree/utils";
import { useGetCategoriesSuspense } from "@e-commerce/api-client/endpoints/product";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useParams } from "next/navigation";
import { alpha } from "@mui/material/styles";

const HOVER_OPACITY = 0.04;
const SELECTED_OPACITY = 0.08;
const SELECTED_HOVER_OPACITY = 0.12;

const CategoryTree = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryQuery = useGetCategoriesSuspense();
  const categories = categoryQuery.data.categories;
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <RichTreeView
        items={getCategoryTreeData(categories)}
        selectedItems={categoryId}
        className="w-full bg-white rounded-xl"
        sx={{
          "& .MuiTreeItem-content": {
            borderRadius: "12px",
            py: 1.25,
            px: 2,
            mb: 0.5,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, HOVER_OPACITY),
              color: "primary.main",
            },
            "&.Mui-selected": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, SELECTED_OPACITY),
              color: "primary.main",
              fontWeight: "600",
              borderLeft: "4px solid",
              borderColor: "primary.main",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, SELECTED_HOVER_OPACITY),
              },
            },
          },
          "& .MuiTreeItem-label": {
            fontSize: "0.95rem",
            fontWeight: "inherit",
          },
        }}
      />
    </Box>
  );
};

export default CategoryTree;
