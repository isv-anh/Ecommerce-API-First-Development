import TextField from "@/components/inputs/TextField/TextField";
import { useGetWarehouseInventoryByIdsSuspense } from "@e-commerce/api-client/endpoints/product";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

type UpdateWarehouseInventoryInput = {
  stock?: unknown;
};

const FormContent = ({
  warehouseId,
  productVariantId,
}: {
  warehouseId: string;
  productVariantId: string;
}) => {
  const { data } = useGetWarehouseInventoryByIdsSuspense(
    warehouseId,
    productVariantId,
  );
  const { control, reset } = useFormContext<UpdateWarehouseInventoryInput>();

  useEffect(() => {
    reset({
      stock: data.stock,
    });
  }, [data.stock, reset]);

  return (
    <Stack spacing={2}>
      <TextField control={control} name="stock" label="Tồn kho" type="number" />
    </Stack>
  );
};

export default FormContent;
