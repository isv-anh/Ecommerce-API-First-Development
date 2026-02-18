import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";
import { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type BaseTextFieldProps<TField extends FieldValues> =
  MuiTextFieldProps & {
    field?: ControllerRenderProps<TField>;
    fieldError?: FieldError;
  };
