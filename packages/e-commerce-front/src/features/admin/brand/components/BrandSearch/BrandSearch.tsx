"use client";
import TextField from "@/components/inputs/TextField/TextField";
import { brandSearchContext } from "@/features/admin/brand/utils";

import type { GetBrandsQueryParams } from "@e-commerce/api-validation/types/product";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const BrandSearch = () => {
  const { params, setParams } = brandSearchContext.useSearch();
  const { reset, control, handleSubmit } = useForm<GetBrandsQueryParams>({
    defaultValues: {},
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: GetBrandsQueryParams) => {
    setParams({ ...data, page: 1 });
  };

  return (
    <Box p={3} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            control={control}
            name="brandName"
            label={"Tên thương hiệu"}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <TextField control={control} name="slug" label={"Slug"} fullWidth />
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

export default BrandSearch;
