import type {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";
import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type BaseTextFieldProps<TField extends FieldValues> =
  MuiTextFieldProps & {
    field?: ControllerRenderProps<TField>;
    fieldError?: FieldError;
  };
