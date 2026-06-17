import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import UpdateProductAttributeSuspense from "@/features/admin/product/components/ProductAttribute/UpdateProductAttribute/components/UpdateProductAttributeSuspense/UpdateProductAttributeSuspense";

import {
  getGetProductAttributesQueryKey,
  useDeleteProductAttribute,
  usePatchProductAttribute,
} from "@e-commerce/api-client/endpoints/product";
import type { ProductAttributeResponse } from "@e-commerce/api-client/schemas/product";
import type { PatchProductAttributeBody } from "@e-commerce/api-validation/types/product";
import { patchProductAttributeBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const UpdateProductAttribute = ({
  open,
  id,
  onClose,
  setRowSelection,
}: Pick<SubmitDialogProps, "open" | "onClose"> & {
  setRowSelection: (rowSelection: ProductAttributeResponse | undefined) => void;
  id: {
    attributeId: string;
    productId: string;
  };
}) => {
  const patchProductAttribute = usePatchProductAttribute();
  const deleteProductAttribute = useDeleteProductAttribute();
  const queryClient = useQueryClient();
  const methods = useForm<PatchProductAttributeBody>({
    defaultValues: {},
    resolver: zodResolver(patchProductAttributeBody),
  });

  const onSubmit = async (data: PatchProductAttributeBody) => {
    try {
      await patchProductAttribute.mutateAsync({
        attributeId: id.attributeId,
        productId: id.productId,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductAttributesQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductAttributesQueryKey(id),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteProductAttribute.mutateAsync({
        ...id,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductAttributesQueryKey(),
      });
      setRowSelection(undefined);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      onDelete={onDelete}
      title="Chỉnh sửa thuộc tính sản phẩm"
      open={open}
      onClose={onClose}
      onSubmit={methods.handleSubmit(onSubmit)}
      width={400}
      loading={
        patchProductAttribute.isPending || deleteProductAttribute.isPending
      }
    >
      <FormProvider {...methods}>
        <SuspenseWrapper height={200}>
          <UpdateProductAttributeSuspense id={id} />
        </SuspenseWrapper>
      </FormProvider>
    </SubmitDialog>
  );
};

export default UpdateProductAttribute;
