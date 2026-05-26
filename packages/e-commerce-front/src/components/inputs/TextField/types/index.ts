import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type TextFieldProps<TField extends FieldValues> = MuiTextFieldProps & {
  control: Control<TField>;
  name: Path<TField>;
};
