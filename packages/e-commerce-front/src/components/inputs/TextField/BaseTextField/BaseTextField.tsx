import TextField from "@mui/material/TextField";
import { BaseTextFieldProps } from "./types";
import { FieldValues } from "react-hook-form";

function BaseTextField<TField extends FieldValues>({
  field,
  fieldError,
  ...props
}: BaseTextFieldProps<TField>) {
  return (
    <TextField
      value={field?.value}
      error={!!fieldError}
      helperText={fieldError?.message}
      onChange={field?.onChange}
      onBlur={field?.onBlur}
      ref={field?.ref}
      {...props}
    />
  );
}

export default BaseTextField;
