import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import SelectCategory from "@/components/inputs/SelectCategory/SelectCategory";
import TextField from "@/components/inputs/TextField/TextField";
import { useGetCategoryByCategoryIdSuspense } from "@e-commerce/api-client/endpoints/product";
import type { PatchCategoryBody } from "@e-commerce/api-validation/types/product";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const FormContent = ({ id }: { id: string }) => {
  const { data } = useGetCategoryByCategoryIdSuspense(id);
  const { control, reset } = useFormContext<PatchCategoryBody>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <Stack spacing={2}>
      <TextField control={control} name="categoryName" label="Tên danh mục" />
      <TextField control={control} name="slug" label="slug" />
      <SuspenseWrapper height={40}>
        <SelectCategory
          control={control}
          name="parentId"
          label="Danh mục cha"
        />
      </SuspenseWrapper>
    </Stack>
  );
};

export default FormContent;
