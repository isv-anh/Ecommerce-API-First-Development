"use client";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import SelectCategory from "@/components/inputs/SelectCategory/SelectCategory";
import TextField from "@/components/inputs/TextField/TextField";
import { categorySearchContext } from "@/features/admin/category/utils";

import type { GetCategoriesQueryParams } from "@e-commerce/api-validation/types/product";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const CategorySearch = () => {
  const { params, setParams } = categorySearchContext.useSearch();
  const { reset, control, handleSubmit } = useForm<GetCategoriesQueryParams>({
    defaultValues: {},
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: GetCategoriesQueryParams) => {
    setParams({ ...data, page: 1 });
  };

  return (
    <Box p={3} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            control={control}
            name="categoryName"
            label={"Tên danh mục"}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <TextField control={control} name="slug" label={"Slug"} fullWidth />
        </Grid>

        <Grid size={12} />

        <Grid size={{ xs: 6, md: 3 }}>
          <SuspenseWrapper height={40}>
            <SelectCategory
              control={control}
              name="parentId"
              label="Danh mục cha"
            />
          </SuspenseWrapper>
        </Grid>
        <Grid size={12} />
        <Grid size={{ xs: 6, md: 3 }}>
          <Stack direction={"row"} spacing={2}>
            <Button
              onClick={() => {
                reset({});
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

export default CategorySearch;
