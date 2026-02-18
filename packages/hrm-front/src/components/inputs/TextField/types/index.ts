import { Control, FieldValues, Path } from "react-hook-form";
import { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type TextFieldProps<TField extends FieldValues> = MuiTextFieldProps & {
  control: Control<TField>;
  name: Path<TField>;
};
