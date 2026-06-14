"use client";
import TextField from "@/components/inputs/TextField/TextField";
import { attributeSearchContext } from "@/features/admin/attribute/utils";

import type { GetAttributesQueryParams } from "@e-commerce/api-validation/types/product";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const AttributeSearch = () => {
  const { params, setParams } = attributeSearchContext.useSearch();
  const { reset, control, handleSubmit } = useForm<GetAttributesQueryParams>({
    defaultValues: {},
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: GetAttributesQueryParams) => {
    setParams({ ...data, page: 1 });
  };

  return (
    <Box p={3} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            control={control}
            name="attributeName"
            label={"Tên thuộc tính"}
            fullWidth
          />
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

export default AttributeSearch;
