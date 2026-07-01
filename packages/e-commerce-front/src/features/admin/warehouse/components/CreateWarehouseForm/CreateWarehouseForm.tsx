import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import TextField from "@/components/inputs/TextField/TextField";
import {
  getGetWarehousesQueryKey,
  usePostWarehouse,
} from "@e-commerce/api-client/endpoints/product";
import type { PostWarehouseBody } from "@e-commerce/api-validation/types/product";
import { postWarehouseBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const CreateWarehouseForm = ({
  open,
  onClose,
}: Pick<SubmitDialogProps, "open" | "onClose">) => {
  const postWarehouse = usePostWarehouse();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<PostWarehouseBody>({
    defaultValues: {},
    resolver: zodResolver(postWarehouseBody),
  });

  const onSubmit = async (data: PostWarehouseBody) => {
    try {
      await postWarehouse.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehousesQueryKey(),
      });
      reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      title="Thêm mới kho"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      width={500}
      loading={postWarehouse.isPending}
    >
      <Stack spacing={2}>
        <TextField control={control} name="name" label="Tên kho" />
        <TextField control={control} name="address" label="Địa chỉ" />
      </Stack>
    </SubmitDialog>
  );
};

export default CreateWarehouseForm;
