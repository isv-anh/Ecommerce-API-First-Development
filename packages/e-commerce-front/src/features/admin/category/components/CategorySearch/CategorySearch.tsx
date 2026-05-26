"use client";
import SigleSelect from "@/components/inputs/SigleSelect/SigleSelect";
import TextField from "@/components/inputs/TextField/TextField";
import { categorySearchContext } from "@/features/admin/category/utils";
import type { GetCategoriesQueryParams } from "@e-commerce/api-validation/types/product";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const CategorySearch = () => {
  const { params, setParams } = categorySearchContext.useSearch();
  const { reset, control } = useForm<GetCategoriesQueryParams>({
    defaultValues: {},
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  return (
    <Box p={3}>
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
          <SigleSelect
            control={control}
            name="parentId"
            label={"Danh mục cha"}
            options={[]}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategorySearch;
