import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import SelectCategory from "@/components/inputs/SelectCategory/SelectCategory";
import TextField from "@/components/inputs/TextField/TextField";
import {
  getGetCategoriesQueryKey,
  usePostCategory,
} from "@e-commerce/api-client/endpoints/product/product";
import type { PostCategoryBody } from "@e-commerce/api-validation/types/product";
import { postCategoryBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const CreateCategoryForm = ({
  open,
  onClose,
}: Pick<SubmitDialogProps, "open" | "onClose">) => {
  const postCategory = usePostCategory();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<PostCategoryBody>({
    defaultValues: {},
    resolver: zodResolver(postCategoryBody),
  });

  const onSubmit = async (data: PostCategoryBody) => {
    try {
      await postCategory.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetCategoriesQueryKey(),
      });
      reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      title="Thêm mới danh mục"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      width={400}
      loading={postCategory.isPending}
    >
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
    </SubmitDialog>
  );
};

export default CreateCategoryForm;
