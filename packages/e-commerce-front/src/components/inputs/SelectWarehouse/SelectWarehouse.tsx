import SingleSelect from "@/components/inputs/SingleSelect/SingleSelect";
import { useGetWarehousesSuspense } from "@e-commerce/api-client/endpoints/product";
import { useMemo } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type SelectWarehouseProps<TField extends FieldValues> = {
  control: Control<TField>;
  name: Path<TField>;
  label: string;
};

const SelectWarehouse = <TField extends FieldValues>({
  control,
  name,
  label,
}: SelectWarehouseProps<TField>) => {
  const { data } = useGetWarehousesSuspense();

  const options = useMemo(
    () =>
      data.warehouses.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.warehouseId,
      })),
    [data.warehouses],
  );

  return (
    <SingleSelect control={control} name={name} label={label} fullWidth options={options} />
  );
};

export default SelectWarehouse;
