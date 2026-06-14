import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import TextField from "@/components/inputs/TextField/TextField";
import {
  getGetAttributesQueryKey,
  usePostAttributes,
} from "@e-commerce/api-client/endpoints/product";
import type { PostAttributesBody } from "@e-commerce/api-validation/types/product";
import { postAttributesBody } from "@e-commerce/api-validation/zod/product";

import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const CreateAttributeForm = ({
  open,
  onClose,
}: Pick<SubmitDialogProps, "open" | "onClose">) => {
  const postAttribute = usePostAttributes();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<PostAttributesBody>({
    defaultValues: {},
    resolver: zodResolver(postAttributesBody),
  });

  const onSubmit = async (data: PostAttributesBody) => {
    try {
      await postAttribute.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetAttributesQueryKey(),
      });
      reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      title="Thêm mới thuộc tính"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      width={400}
      loading={postAttribute.isPending}
    >
      <Stack spacing={2}>
        <TextField
          control={control}
          name="attributeName"
          label="Tên thuộc tính"
        />
      </Stack>
    </SubmitDialog>
  );
};

export default CreateAttributeForm;
