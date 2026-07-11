"use client";
import SelectProductVariant from "@/components/inputs/SelectProductVariant/SelectProductVariant";
import SelectWarehouse from "@/components/inputs/SelectWarehouse/SelectWarehouse";
import type { WarehouseInventorySearchParams } from "@/features/admin/warehouse-inventory/utils";
import { warehouseInventorySearchContext } from "@/features/admin/warehouse-inventory/utils";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const WarehouseInventorySearch = () => {
  const { params, setParams } = warehouseInventorySearchContext.useSearch();
  const { reset, control, handleSubmit } =
    useForm<WarehouseInventorySearchParams>({
      defaultValues: {},
    });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: WarehouseInventorySearchParams) => {
    setParams({ ...data, page: 1 });
  };

  return (
    <Box p={3} component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 6, md: 3 }}>
          <SelectWarehouse control={control} name="warehouseId" label="Kho" />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <SelectProductVariant
            control={control}
            name="productVariantId"
            label="Phiên bản sản phẩm"
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

export default WarehouseInventorySearch;
