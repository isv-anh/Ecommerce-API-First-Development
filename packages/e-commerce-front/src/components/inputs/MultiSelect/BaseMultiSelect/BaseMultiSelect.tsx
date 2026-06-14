import type { BaseMultiSelectProps } from "@/components/inputs/MultiSelect/BaseMultiSelect/types";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import BaseTextField from "@/components/inputs/TextField/BaseTextField/BaseTextField";
import type { FieldValues } from "react-hook-form";
import Chip from "@mui/material/Chip";

function BaseMultiSelect<TField extends FieldValues>({
  field,
  fieldError,
  options,
  label,
  ...props
}: BaseMultiSelectProps<TField>) {
  const selectedValues = Array.isArray(field?.value)
    ? (field.value as (string | number)[])
    : [];

  return (
    <FormControl fullWidth>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options}
        getOptionLabel={(option) => option.label}
        value={options.filter((item) => selectedValues.includes(item.value))}
        onChange={(_, selectedOptions) => {
          field?.onChange(selectedOptions.map((item) => item.value));
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;

          return (
            <li key={key} {...optionProps}>
              <Checkbox checked={selected} sx={{ mr: 1 }} />
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <BaseTextField {...params} label={label} error={!!fieldError} />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.label}
                size="small"
                {...tagProps}
                sx={{ height: 22, fontSize: 12 }}
              />
            );
          })
        }
        {...props}
      />

      <FormHelperText>{fieldError?.message}</FormHelperText>
    </FormControl>
  );
}

export default BaseMultiSelect;
