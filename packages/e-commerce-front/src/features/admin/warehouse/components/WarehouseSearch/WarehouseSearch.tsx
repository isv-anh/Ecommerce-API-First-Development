"use client";
import TextField from "@/components/inputs/TextField/TextField";
import type { WarehouseSearchParams } from "@/features/admin/warehouse/utils";
import { warehouseSearchContext } from "@/features/admin/warehouse/utils";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const WarehouseSearch = () => {
  const { params, setParams } = warehouseSearchContext.useSearch();
  const { reset, control, handleSubmit } = useForm<WarehouseSearchParams>({
    defaultValues: {},
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: WarehouseSearchParams) => {
    setParams({ ...data, page: 1 });
  };

  return (
    <Box p={3} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField control={control} name="name" label={"Tên kho"} fullWidth />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            control={control}
            name="address"
            label={"Địa chỉ"}
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

export default WarehouseSearch;
