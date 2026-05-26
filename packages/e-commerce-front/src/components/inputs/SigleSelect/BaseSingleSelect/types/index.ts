import type { SelectOption } from "@/components/inputs/MultiSelect/BaseMultiSelect/types";
import type { SelectProps } from "@mui/material/Select";
import type {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

export type BaseSingleSelectProps<TField extends FieldValues> = SelectProps & {
  name: Path<TField>;
  field?: ControllerRenderProps<TField>;
  fieldError?: FieldError;
  options: SelectOption[];
};
