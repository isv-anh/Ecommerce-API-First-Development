import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import type { SubmitDialogProps } from "@/components/feedback/SubmitDialog/types";
import SelectProductVariant from "@/components/inputs/SelectProductVariant/SelectProductVariant";
import SelectWarehouse from "@/components/inputs/SelectWarehouse/SelectWarehouse";
import TextField from "@/components/inputs/TextField/TextField";
import {
  getGetWarehouseInventoriesQueryKey,
  usePostWarehouseInventory,
} from "@e-commerce/api-client/endpoints/product";
import { postWarehouseInventoryBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createWarehouseInventorySchema = postWarehouseInventoryBody.extend({
  stock: z.coerce.number(),
});

type CreateWarehouseInventoryInput = z.input<
  typeof createWarehouseInventorySchema
>;
type CreateWarehouseInventoryOutput = z.output<
  typeof createWarehouseInventorySchema
>;

const CreateWarehouseInventoryForm = ({
  open,
  onClose,
}: Pick<SubmitDialogProps, "open" | "onClose">) => {
  const postWarehouseInventory = usePostWarehouseInventory();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<
    CreateWarehouseInventoryInput,
    unknown,
    CreateWarehouseInventoryOutput
  >({
    defaultValues: {},
    resolver: zodResolver(createWarehouseInventorySchema),
  });

  const onSubmit = async (data: CreateWarehouseInventoryOutput) => {
    try {
      await postWarehouseInventory.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetWarehouseInventoriesQueryKey(),
      });
      reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitDialog
      title="Thêm mới tồn kho"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      width={500}
      loading={postWarehouseInventory.isPending}
    >
      <Stack spacing={2}>
        <SelectWarehouse control={control} name="warehouseId" label="Kho" />
        <SelectProductVariant
          control={control}
          name="productVariantId"
          label="Phiên bản sản phẩm"
        />
        <TextField control={control} name="stock" label="Tồn kho" type="number" />
      </Stack>
    </SubmitDialog>
  );
};

export default CreateWarehouseInventoryForm;
