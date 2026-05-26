import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import TextField from "@/components/inputs/TextField/TextField";
import {
  getGetBrandsQueryKey,
  usePostBrand,
} from "@e-commerce/api-client/endpoints/product/product";
import type { PostBrandBody } from "@e-commerce/api-validation/types/product";
import { postBrandBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const CreateBrandForm = ({
  open,
  onClose,
}: Pick<SubmitDialogProps, "open" | "onClose">) => {
  const postBrand = usePostBrand();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<PostBrandBody>({
    defaultValues: {},
    resolver: zodResolver(postBrandBody),
  });

  const onSubmit = async (data: PostBrandBody) => {
    try {
      await postBrand.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetBrandsQueryKey(),
      });
      reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      title="Thêm mới thương hiệu"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      width={400}
      loading={postBrand.isPending}
    >
      <Stack spacing={2}>
        <TextField control={control} name="brandName" label="Tên thương hiệu" />
        <TextField control={control} name="slug" label="slug" />
      </Stack>
    </SubmitDialog>
  );
};

export default CreateBrandForm;
