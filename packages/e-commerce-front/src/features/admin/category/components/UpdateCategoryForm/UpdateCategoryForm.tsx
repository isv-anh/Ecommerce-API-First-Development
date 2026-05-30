import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";

import FormContent from "@/features/admin/category/components/UpdateCategoryForm/components/FormContent/FormContent";
import {
  getGetCategoriesQueryKey,
  getGetCategoryByCategoryIdQueryKey,
  useDeleteCategory,
  usePatchCategory,
} from "@e-commerce/api-client/endpoints/product/product";
import type { CategoryResponse } from "@e-commerce/api-client/schemas/product";
import type { PatchCategoryBody } from "@e-commerce/api-validation/types/product";
import { patchCategoryBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const UpdateCategoryForm = ({
  open,
  id,
  onClose,

  setRowSelection,
}: Pick<SubmitDialogProps, "open" | "onClose"> & {
  setRowSelection: (rowSelection: CategoryResponse | undefined) => void;
  id: string;
}) => {
  const patchCategory = usePatchCategory();
  const deleteCategory = useDeleteCategory();
  const queryClient = useQueryClient();
  const methods = useForm<PatchCategoryBody>({
    defaultValues: {},
    resolver: zodResolver(patchCategoryBody),
  });

  const onSubmit = async (data: PatchCategoryBody) => {
    try {
      await patchCategory.mutateAsync({
        categoryId: id,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetCategoriesQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetCategoryByCategoryIdQueryKey(id),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteCategory.mutateAsync({
        categoryId: id,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetCategoriesQueryKey(),
      });
      setRowSelection(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      onDelete={onDelete}
      title="Chỉnh sửa danh mục"
      open={open}
      onClose={onClose}
      onSubmit={methods.handleSubmit(onSubmit)}
      width={400}
      loading={patchCategory.isPending || deleteCategory.isPending}
    >
      <FormProvider {...methods}>
        <SuspenseWrapper height={200}>
          <FormContent id={id} />
        </SuspenseWrapper>
      </FormProvider>
    </SubmitDialog>
  );
};

export default UpdateCategoryForm;
