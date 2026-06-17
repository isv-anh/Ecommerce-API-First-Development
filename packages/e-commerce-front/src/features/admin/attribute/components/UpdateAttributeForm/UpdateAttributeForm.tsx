import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import UpdateAttributeFormSuspense from "@/features/admin/attribute/components/UpdateAttributeForm/components/UpdateAttributeFormSuspense/UpdateAttributeFormSuspense";

import {
  usePatchAttribute,
  useDeleteAttribute,
  getGetAttributesQueryKey,
  getGetAttributeByIdQueryKey,
} from "@e-commerce/api-client/endpoints/product";
import type { AttributeResponse } from "@e-commerce/api-client/schemas/product";
import type { PatchAttributeBody } from "@e-commerce/api-validation/types/product";
import { patchAttributeBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { FormProvider, useForm } from "react-hook-form";

const UpdateAttributeForm = ({
  open,
  id,
  onClose,

  setRowSelection,
}: Pick<SubmitDialogProps, "open" | "onClose"> & {
  setRowSelection: (rowSelection: AttributeResponse | undefined) => void;
  id: string;
}) => {
  const patchAttribute = usePatchAttribute();
  const deleteAttribute = useDeleteAttribute();

  const queryClient = useQueryClient();
  const methods = useForm<PatchAttributeBody>({
    defaultValues: {},
    resolver: zodResolver(patchAttributeBody),
  });

  const onSubmit = async (data: PatchAttributeBody) => {
    try {
      await patchAttribute.mutateAsync({
        attributeId: id,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetAttributesQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetAttributeByIdQueryKey(id),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteAttribute.mutateAsync({
        attributeId: id,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetAttributesQueryKey(),
      });
      setRowSelection(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      onDelete={onDelete}
      title="Chỉnh sửa thuộc tính"
      open={open}
      onClose={onClose}
      onSubmit={methods.handleSubmit(onSubmit)}
      width={400}
      loading={patchAttribute.isPending || deleteAttribute.isPending}
    >
      <FormProvider {...methods}>
        <SuspenseWrapper height={200}>
          <UpdateAttributeFormSuspense id={id} />
        </SuspenseWrapper>
      </FormProvider>
    </SubmitDialog>
  );
};

export default UpdateAttributeForm;
