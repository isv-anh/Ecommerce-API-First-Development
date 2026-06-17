import type { Control, FieldValues, Path } from "react-hook-form";

export type SelectAttributeProps<TField extends FieldValues> = {
  control: Control<TField>;
  name: Path<TField>;
  label?: string;
};
