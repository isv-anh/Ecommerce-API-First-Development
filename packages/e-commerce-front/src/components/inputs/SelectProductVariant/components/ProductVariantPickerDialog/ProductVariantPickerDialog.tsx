import DataGrid from "@/components/data-display/DataGrid/DataGrid";
import {
  useGetProductsSuspense,
  useGetProductVariantsSuspense,
} from "@e-commerce/api-client/endpoints/product";
import type {
  ProductResponse,
  ProductVariantResponse,
} from "@e-commerce/api-client/schemas/product";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import MuiTextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

type ProductVariantPickerDialogProps = {
  open: boolean;
  initialProductId?: string;
  onClose: () => void;
  onConfirm: (variant: ProductVariantResponse, productName?: string) => void;
};

const defaultPage = 1;
const defaultPageSize = 10;
const dialogWidth = 960;
const gridHeight = 360;

const ProductVariantPickerDialog = ({
  open,
  initialProductId,
  onClose,
  onConfirm,
}: ProductVariantPickerDialogProps) => {
  const [productName, setProductName] = useState("");
  const [productParams, setProductParams] = useState({
    page: defaultPage,
    pageSize: defaultPageSize,
  });
  const [selectedProductId, setSelectedProductId] =
    useState<string | undefined>(initialProductId);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantResponse>();

  const { data: productsData, isFetching: isFetchingProducts } =
    useGetProductsSuspense(productParams);
  const { data: productVariantsData, isFetching: isFetchingProductVariants } =
    useGetProductVariantsSuspense(
      selectedProductId ? { productId: selectedProductId } : undefined,
    );

  const selectedProductName = useMemo(() => {
    return productsData.products.find(
      (product) => product.productId === selectedProductId,
    )?.productName;
  }, [productsData.products, selectedProductId]);

  const productColumns: GridColDef<ProductResponse>[] = [
    { field: "productId", headerName: "ID", flex: 1 },
    { field: "productName", headerName: "Sản phẩm", flex: 1 },
    { field: "categoryName", headerName: "Danh mục", flex: 1 },
    { field: "price", headerName: "Giá", flex: 1, type: "number" },
  ];

  const variantColumns: GridColDef<ProductVariantResponse>[] = [
    { field: "productVariantId", headerName: "ID", flex: 1 },
    { field: "sku", headerName: "SKU", flex: 1 },
    { field: "price", headerName: "Giá", flex: 1, type: "number" },
    { field: "stock", headerName: "Tồn kho", flex: 1, type: "number" },
  ];

  const productRows = useMemo(
    () =>
      productsData.products.map((product) => ({
        id: product.productId,
        ...product,
      })),
    [productsData.products],
  );

  const variantRows = useMemo(
    () =>
      productVariantsData.productVariants.map((variant) => ({
        id: variant.productVariantId,
        ...variant,
      })),
    [productVariantsData.productVariants],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { width: dialogWidth } }}
    >
      <DialogTitle>Chọn phiên bản sản phẩm</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <MuiTextField
                  label="Tên sản phẩm"
                  value={productName}
                  size="small"
                  fullWidth
                  onChange={(event) => setProductName(event.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() =>
                    setProductParams((prev) => ({
                      ...prev,
                      page: defaultPage,
                      productName: productName || undefined,
                    }))
                  }
                >
                  Tìm
                </Button>
              </Stack>
              <Stack sx={{ height: gridHeight }}>
                <DataGrid
                  columns={productColumns}
                  rows={productRows}
                  page={productParams.page}
                  pageSize={productParams.pageSize}
                  paginationModelChange={(model) =>
                    setProductParams((prev) => ({
                      ...prev,
                      page: model.page + 1,
                      pageSize: model.pageSize,
                    }))
                  }
                  rowCount={productsData.totalCount}
                  loading={isFetchingProducts}
                  onRowClick={(params) => {
                    setSelectedProductId(params.row.productId);
                    setSelectedVariant(undefined);
                  }}
                  columnVisibilityModel={{
                    productId: false,
                  }}
                  slotProps={{
                    toolbar: {
                      leftButtons: [],
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="regularS">
                {selectedProductName ?? "Chọn sản phẩm để xem variant"}
              </Typography>
              <Stack sx={{ height: gridHeight }}>
                <DataGrid
                  columns={variantColumns}
                  rows={selectedProductId ? variantRows : []}
                  page={defaultPage}
                  pageSize={defaultPageSize}
                  rowCount={selectedProductId ? variantRows.length : 0}
                  loading={isFetchingProductVariants}
                  onRowClick={(params) => {
                    setSelectedVariant(params.row);
                  }}
                  columnVisibilityModel={{
                    productVariantId: false,
                  }}
                  slotProps={{
                    toolbar: {
                      leftButtons: [],
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Hủy
        </Button>
        <Button
          variant="contained"
          disabled={!selectedVariant}
          onClick={() => {
            if (!selectedVariant) return;
            onConfirm(selectedVariant, selectedProductName);
          }}
        >
          Chọn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductVariantPickerDialog;
