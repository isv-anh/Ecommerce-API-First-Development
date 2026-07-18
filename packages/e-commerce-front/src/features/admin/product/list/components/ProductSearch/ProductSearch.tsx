"use client";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import SelectCategory from "@/components/inputs/SelectCategory/SelectCategory";
import TextField from "@/components/inputs/TextField/TextField";
import { productSearchContext } from "@/features/admin/product/list/utils";
import type { GetProductsQueryParams } from "@e-commerce/api-validation/types/product";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ProductSearch = () => {
  const { params, setParams } = productSearchContext.useSearch();
  const defaultValues = {
    productName: "",
    categoryId: "",
  };
  const { reset, control, handleSubmit } = useForm<GetProductsQueryParams>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: GetProductsQueryParams) => {
    setParams({ ...data, page: 1 });
  };

  return (
    <Box p={3} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            control={control}
            name="productName"
            label={"Tên sản phẩm"}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <SuspenseWrapper height={40}>
            <SelectCategory
              control={control}
              name="categoryIds"
              label="Danh mục"
            />
          </SuspenseWrapper>
        </Grid>
        <Grid size={12} />
        <Grid size={{ xs: 6, md: 3 }}>
          <Stack direction={"row"} spacing={2}>
            <Button
              onClick={() => {
                reset(defaultValues);
              }}
            >
              Đặt lại
            </Button>
            <Button variant="contained" type="submit">
              Tìm kiếm
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductSearch;
