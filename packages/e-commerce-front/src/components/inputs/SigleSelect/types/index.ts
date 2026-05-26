import type { BaseSingleSelectProps } from "@/components/inputs/SigleSelect/BaseSingleSelect/types";
import type { Control, FieldValues, Path } from "react-hook-form";

export type SingleSelectProps<TField extends FieldValues> =
  BaseSingleSelectProps<TField> & {
    control: Control<TField>;
    name: Path<TField>;
  };
