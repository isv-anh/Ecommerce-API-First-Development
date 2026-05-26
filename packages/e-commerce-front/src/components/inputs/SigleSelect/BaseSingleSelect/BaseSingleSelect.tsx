import type { BaseSingleSelectProps } from "@/components/inputs/SigleSelect/BaseSingleSelect/types";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { FieldValues } from "react-hook-form";

const BaseSingleSelect = <TField extends FieldValues>({
  options,
  field,
  name,
  label,
  labelId,
  fullWidth,
  fieldError,
  ...props
}: BaseSingleSelectProps<TField>) => {
  const hasError = !!fieldError;
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        {...props}
        {...field}
        name={name}
        labelId={labelId}
        label={label}
        value={field?.value ?? ""}
        onChange={field?.onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{fieldError.message}</FormHelperText>}
    </FormControl>
  );
};

export default BaseSingleSelect;
