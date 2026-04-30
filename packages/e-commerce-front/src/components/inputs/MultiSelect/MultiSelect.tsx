import BaseMultiSelect from "@/components/inputs/MultiSelect/BaseMultiSelect/BaseMultiSelect";
import { MultiSelectProps } from "@/components/inputs/MultiSelect/types";
import { Controller, FieldValues } from "react-hook-form";

function MultiSelect<TField extends FieldValues>({
  control,
  name,
  options,
  ...props
}: MultiSelectProps<TField>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <BaseMultiSelect
          field={field}
          name={name}
          fieldError={fieldState.error}
          options={options}
          {...props}
        />
      )}
    />
  );
}

export default MultiSelect;
