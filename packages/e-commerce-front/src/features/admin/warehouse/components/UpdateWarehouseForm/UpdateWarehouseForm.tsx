import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import FormContent from "@/features/admin/warehouse/components/UpdateWarehouseForm/components/FormContent/FormContent";

import {
  getGetWarehouseByIdQueryKey,
  getGetWarehousesQueryKey,
  useDeleteWarehouse,
  usePatchWarehouse,
} from "@e-commerce/api-client/endpoints/product";
import type { Warehouse } from "@e-commerce/api-client/schemas/product";
import type { PatchWarehouseBody } from "@e-commerce/api-validation/types/product";
import { patchWarehouseBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const UpdateWarehouseForm = ({
  open,
  id,
  onClose,
  setRowSelection,
}: Pick<SubmitDialogProps, "open" | "onClose"> & {
  setRowSelection: (rowSelection: Warehouse | undefined) => void;
  id: string;
}) => {
  const patchWarehouse = usePatchWarehouse();
  const deleteWarehouse = useDeleteWarehouse();
  const queryClient = useQueryClient();
  const methods = useForm<PatchWarehouseBody>({
    defaultValues: {},
    resolver: zodResolver(patchWarehouseBody),
  });

  const onSubmit = async (data: PatchWarehouseBody) => {
    try {
      await patchWarehouse.mutateAsync({
        warehouseId: id,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehousesQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehouseByIdQueryKey(id),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteWarehouse.mutateAsync({
        warehouseId: id,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehousesQueryKey(),
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
      title="Chỉnh sửa kho"
      open={open}
      onClose={onClose}
      onSubmit={methods.handleSubmit(onSubmit)}
      width={500}
      loading={patchWarehouse.isPending || deleteWarehouse.isPending}
    >
      <FormProvider {...methods}>
        <SuspenseWrapper height={200}>
          <FormContent id={id} />
        </SuspenseWrapper>
      </FormProvider>
    </SubmitDialog>
  );
};

export default UpdateWarehouseForm;
