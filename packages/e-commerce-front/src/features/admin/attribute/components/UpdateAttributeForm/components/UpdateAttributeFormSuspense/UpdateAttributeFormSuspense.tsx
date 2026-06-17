import TextField from "@/components/inputs/TextField/TextField";
import { useGetAttributeByIdSuspense } from "@e-commerce/api-client/endpoints/product";
import type { PatchAttributeBody } from "@e-commerce/api-validation/types/product";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const UpdateAttributeFormSuspense = ({ id }: { id: string }) => {
  const { data } = useGetAttributeByIdSuspense(id);
  const { control, reset } = useFormContext<PatchAttributeBody>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <TextField control={control} name="attributeName" label="Tên thuộc tính" />
  );
};

export default UpdateAttributeFormSuspense;
