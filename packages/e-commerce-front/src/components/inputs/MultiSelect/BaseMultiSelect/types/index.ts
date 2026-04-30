import { AutocompleteProps } from "@mui/material/Autocomplete";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

export type SelectOption = {
  label: string;
  value: string | number;
};

export type BaseMultiSelectProps<TField extends FieldValues> = Omit<
  AutocompleteProps<SelectOption, true, false, false>,
  "renderInput"
> & {
  label?: string;
  name: Path<TField>;
  field?: ControllerRenderProps<TField>;
  fieldError?: FieldError;
  options: SelectOption[];
  labelDirection?: "row" | "column";
  required?: boolean;
  maxDisplayChips?: number;
};
