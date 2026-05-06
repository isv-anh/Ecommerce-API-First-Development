import { Control, FieldValues, Path } from "react-hook-form";

import { SelectOption } from "@/components/inputs/MultiSelect/BaseMultiSelect/types";
import { AutocompleteProps } from "@mui/material/Autocomplete";

export type MultiSelectProps<TField extends FieldValues> = Omit<
  AutocompleteProps<SelectOption, true, false, false>,
  "renderInput"
> & {
  label?: string;
  control: Control<TField>;
  name: Path<TField>;
  options: SelectOption[];
  labelDirection?: "row" | "column";
  required?: boolean;
  placeholder?: string;
};
