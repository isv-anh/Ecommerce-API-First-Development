import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import UpdateVariantSuspense from "@/features/admin/product/components/ProductVariant/UpdateVariant/components/UpdateVariantSuspense/UpdateVariantSuspense";
import {
  getGetProductVariantByIdQueryKey,
  getGetProductVariantsQueryKey,
  useDeleteProductVariant,
  usePatchProductVariant,
} from "@e-commerce/api-client/endpoints/product";
import type { ProductVariantResponse } from "@e-commerce/api-client/schemas/product";
import type { PatchProductVariantBody } from "@e-commerce/api-validation/types/product";
import { patchProductVariantBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const UpdateVariant = ({
  productVariantId,
  open,
  onClose,
  setRowSelection,
}: {
  productVariantId: string;
  open: boolean;
  onClose: () => void;
  setRowSelection: (rowSelection: ProductVariantResponse | undefined) => void;
}) => {
  const patchVariant = usePatchProductVariant();
  const deleteProductVariant = useDeleteProductVariant();
  const queryClient = useQueryClient();
  const methods = useForm<PatchProductVariantBody>({
    resolver: zodResolver(patchProductVariantBody),
  });

  const onSubmit = async (data: PatchProductVariantBody) => {
    try {
      await patchVariant.mutateAsync({
        productVariantId,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductVariantsQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductVariantByIdQueryKey(productVariantId),
      });
      methods.reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteProductVariant.mutateAsync({
        productVariantId,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductVariantsQueryKey(),
      });
      setRowSelection(undefined);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <SubmitDialog
        onDelete={onDelete}
        open={open}
        onClose={() => {
          onClose();
        }}
        onSubmit={methods.handleSubmit(onSubmit, (err) => console.log(err))}
        title="Cập nhật phân loại sản phẩm"
        width={500}
      >
        <SuspenseWrapper height={200}>
          <UpdateVariantSuspense productVariantId={productVariantId} />
        </SuspenseWrapper>
      </SubmitDialog>
    </FormProvider>
  );
};

export default UpdateVariant;
