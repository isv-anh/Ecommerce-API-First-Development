import BaseTextField from "@/components/inputs/TextField/BaseTextField/BaseTextField";
import type { TextFieldProps } from "@/components/inputs/TextField/types";
import type { FieldError, Path, PathValue } from "react-hook-form";
import {
  Controller,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";
import { useState } from "react";

function formatCurrency(value: number | string): string {
  if (value === "" || value === null || value === undefined) return "";
  const num =
    typeof value === "string" ? parseFloat(value.replace(/\./g, "")) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("vi-VN").format(num);
}

function parseCurrency(value: string): string {
  return value.replace(/[^\d]/g, "");
}

type CurrencyInputProps<TField extends FieldValues> = Omit<
  TextFieldProps<TField>,
  "control" | "name"
> & {
  field: ControllerRenderProps<TField>;
  fieldError?: FieldError;
};

function CurrencyInput<TField extends FieldValues>({
  field,
  fieldError,
  ...props
}: CurrencyInputProps<TField>) {
  const [isFocused, setIsFocused] = useState(false);
  const [rawInput, setRawInput] = useState<string>("");

  const displayValue = isFocused ? rawInput : formatCurrency(field.value);

  const handleFocus = () => {
    setIsFocused(true);
    setRawInput(
      field.value === "" || field.value === null || field.value === undefined
        ? ""
        : String(field.value),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrency(e.target.value);
    field.onChange(raw === "" ? "" : Number(raw));
    setRawInput(raw);
  };

  const handleBlur = () => {
    setIsFocused(false);
    field.onBlur();
  };

  const fieldWithFocus: ControllerRenderProps<TField> & {
    onFocus: React.FocusEventHandler<HTMLInputElement>;
  } = {
    ...field,
    value: displayValue as PathValue<TField, Path<TField>>,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <BaseTextField {...props} field={fieldWithFocus} fieldError={fieldError} />
  );
}

export default function CurrencyField<TField extends FieldValues>({
  control,
  name,
  ...props
}: TextFieldProps<TField>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <CurrencyInput {...props} field={field} fieldError={error} />
      )}
    />
  );
}
