import { Controller, type FieldValues } from "react-hook-form";
import type { TextFieldProps } from "./types";
import BaseTextField from "./BaseTextField/BaseTextField";

export default function TextField<TField extends FieldValues>({
  control,
  name,
  ...props
}: TextFieldProps<TField>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return <BaseTextField {...props} field={field} fieldError={error} />;
      }}
    />
  );
}
