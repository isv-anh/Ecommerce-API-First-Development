import TextField from "@/components/inputs/TextField/TextField";
import { useGetWarehouseByIdSuspense } from "@e-commerce/api-client/endpoints/product";
import type { PatchWarehouseBody } from "@e-commerce/api-validation/types/product";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const FormContent = ({ id }: { id: string }) => {
  const { data } = useGetWarehouseByIdSuspense(id);
  const { control, reset } = useFormContext<PatchWarehouseBody>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <Stack spacing={2}>
      <TextField control={control} name="name" label="Tên kho" />
      <TextField control={control} name="address" label="Địa chỉ" />
    </Stack>
  );
};

export default FormContent;
