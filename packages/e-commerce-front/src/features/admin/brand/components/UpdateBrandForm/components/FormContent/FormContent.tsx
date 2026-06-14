import TextField from "@/components/inputs/TextField/TextField";
import { useGetBrandByBrandIdSuspense } from "@e-commerce/api-client/endpoints/product";
import type { PatchBrandBody } from "@e-commerce/api-validation/types/product";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const FormContent = ({ id }: { id: string }) => {
  const { data } = useGetBrandByBrandIdSuspense(id);
  const { control, reset } = useFormContext<PatchBrandBody>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <Stack spacing={2}>
      <TextField control={control} name="brandName" label="Tên thương hiệu" />
      <TextField control={control} name="slug" label="slug" />
    </Stack>
  );
};

export default FormContent;
