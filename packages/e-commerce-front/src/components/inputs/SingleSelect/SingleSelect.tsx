import BaseSingleSelect from "@/components/inputs/SingleSelect/BaseSingleSelect/BaseSingleSelect";
import type { SingleSelectProps } from "@/components/inputs/SingleSelect/types";
import { Controller, type FieldValues } from "react-hook-form";

const SingleSelect = <TField extends FieldValues>({
  control,
  name,
  options,
  ...props
}: SingleSelectProps<TField>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <BaseSingleSelect
          field={field}
          name={name}
          fieldError={fieldState.error}
          options={options}
          {...props}
        />
      )}
    />
  );
};

export default SingleSelect;
