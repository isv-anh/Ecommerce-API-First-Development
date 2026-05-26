import type { SelectOption } from "@/components/inputs/MultiSelect/BaseMultiSelect/types";
import type { SelectProps } from "@mui/material/Select";
import type {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";

export type BaseSingleSelectProps<TField extends FieldValues> = SelectProps &
  (ClientMode<TField> | ServerMode<TField>);

type CommonProps<TField extends FieldValues> = {
  field?: ControllerRenderProps<TField>;
  fieldError?: FieldError;
  options: SelectOption[];
};

export type ClientMode<TField extends FieldValues> = CommonProps<TField> & {
  mode?: "client";
  search?: never;
  onSearchChange?: never;
  onLoadMore?: never;
  isLoadMore?: never;
  loading?: never;
};

export type ServerMode<TField extends FieldValues> = CommonProps<TField> & {
  mode?: "server";
  search: string;
  onSearchChange: (text: string) => void;
  onLoadMore: () => void;
  isLoadMore?: boolean;
  loading?: boolean;
};
