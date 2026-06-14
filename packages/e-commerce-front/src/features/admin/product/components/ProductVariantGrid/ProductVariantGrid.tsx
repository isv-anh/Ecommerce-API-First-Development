import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import { useGetProductVariantsSuspense } from "@e-commerce/api-client/endpoints/product";
import type { GridColDef } from "@mui/x-data-grid";

const ProductVariantGrid = ({ productId }: { productId: string }) => {
  const queryProductVariant = useGetProductVariantsSuspense({
    productId: productId,
  });

  const columns: GridColDef[] = [
    {
      field: "",
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={queryProductVariant.data.productVariants}
    />
  );
};

export default ProductVariantGrid;
