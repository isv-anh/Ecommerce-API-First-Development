import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import FormContent from "@/features/admin/warehouse-inventory/components/UpdateWarehouseInventoryForm/components/FormContent/FormContent";

import {
  getGetWarehouseInventoriesQueryKey,
  getGetWarehouseInventoryByIdsQueryKey,
  useDeleteWarehouseInventory,
  usePatchWarehouseInventory,
} from "@e-commerce/api-client/endpoints/product";
import type { WarehouseInventoryResponse } from "@e-commerce/api-client/schemas/product";
import { patchWarehouseInventoryBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const updateWarehouseInventorySchema = patchWarehouseInventoryBody.extend({
  stock: z.coerce.number().optional(),
});

type UpdateWarehouseInventoryInput = z.input<
  typeof updateWarehouseInventorySchema
>;
type UpdateWarehouseInventoryOutput = z.output<
  typeof updateWarehouseInventorySchema
>;

const UpdateWarehouseInventoryForm = ({
  open,
  warehouseId,
  productVariantId,
  onClose,
  setRowSelection,
}: Pick<SubmitDialogProps, "open" | "onClose"> & {
  setRowSelection: (
    rowSelection: WarehouseInventoryResponse | undefined,
  ) => void;
  warehouseId: string;
  productVariantId: string;
}) => {
  const patchWarehouseInventory = usePatchWarehouseInventory();
  const deleteWarehouseInventory = useDeleteWarehouseInventory();
  const queryClient = useQueryClient();
  const methods = useForm<
    UpdateWarehouseInventoryInput,
    unknown,
    UpdateWarehouseInventoryOutput
  >({
    defaultValues: {},
    resolver: zodResolver(updateWarehouseInventorySchema),
  });

  const onSubmit = async (data: UpdateWarehouseInventoryOutput) => {
    try {
      await patchWarehouseInventory.mutateAsync({
        warehouseId,
        productVariantId,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehouseInventoriesQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehouseInventoryByIdsQueryKey(
          warehouseId,
          productVariantId,
        ),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteWarehouseInventory.mutateAsync({
        warehouseId,
        productVariantId,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehouseInventoriesQueryKey(),
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
      title="Chỉnh sửa tồn kho"
      open={open}
      onClose={onClose}
      onSubmit={methods.handleSubmit(onSubmit)}
      width={500}
      loading={
        patchWarehouseInventory.isPending || deleteWarehouseInventory.isPending
      }
    >
      <FormProvider {...methods}>
        <SuspenseWrapper height={120}>
          <FormContent
            warehouseId={warehouseId}
            productVariantId={productVariantId}
          />
        </SuspenseWrapper>
      </FormProvider>
    </SubmitDialog>
  );
};

export default UpdateWarehouseInventoryForm;
