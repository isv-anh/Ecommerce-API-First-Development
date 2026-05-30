import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import FormContent from "@/features/admin/brand/components/UpdateBrandForm/components/FormContent/FormContent";

import {
  getGetBrandsQueryKey,
  getGetBrandByBrandIdQueryKey,
  useDeleteBrand,
  usePatchBrand,
} from "@e-commerce/api-client/endpoints/product/product";
import type { BrandResponse } from "@e-commerce/api-client/schemas/product";
import type { PatchBrandBody } from "@e-commerce/api-validation/types/product";
import { patchBrandBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const UpdateBrandForm = ({
  open,
  id,
  onClose,

  setRowSelection,
}: Pick<SubmitDialogProps, "open" | "onClose"> & {
  setRowSelection: (rowSelection: BrandResponse | undefined) => void;
  id: string;
}) => {
  const patchBrand = usePatchBrand();
  const deleteBrand = useDeleteBrand();
  const queryClient = useQueryClient();
  const methods = useForm<PatchBrandBody>({
    defaultValues: {},
    resolver: zodResolver(patchBrandBody),
  });

  const onSubmit = async (data: PatchBrandBody) => {
    try {
      await patchBrand.mutateAsync({
        brandId: id,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetBrandsQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetBrandByBrandIdQueryKey(id),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteBrand.mutateAsync({
        brandId: id,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetBrandsQueryKey(),
      });
      setRowSelection(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      onDelete={onDelete}
      title="Chỉnh sửa thương hiệu"
      open={open}
      onClose={onClose}
      onSubmit={methods.handleSubmit(onSubmit)}
      width={400}
      loading={patchBrand.isPending || deleteBrand.isPending}
    >
      <FormProvider {...methods}>
        <SuspenseWrapper height={200}>
          <FormContent id={id} />
        </SuspenseWrapper>
      </FormProvider>
    </SubmitDialog>
  );
};

export default UpdateBrandForm;
