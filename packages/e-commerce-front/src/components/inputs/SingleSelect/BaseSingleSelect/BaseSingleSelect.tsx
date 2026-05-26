import type { BaseSingleSelectProps } from "@/components/inputs/SingleSelect/BaseSingleSelect/types";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { FieldValues } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import BaseTextField from "@/components/inputs/TextField/BaseTextField/BaseTextField";
import { useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const BaseSingleSelect = <TField extends FieldValues>({
  options,
  field,
  label,
  labelId,
  fullWidth,
  fieldError,
  mode = "client",
  search,
  onSearchChange,
  onLoadMore,
  loading = false,
  isLoadMore = false,
  ...props
}: BaseSingleSelectProps<TField>) => {
  const hasError = !!fieldError;
  const [clientSearch, setClientSearch] = useState("");

  const searchText = mode === "server" ? search : clientSearch;

  const filteredOptions = useMemo(() => {
    if (mode === "server") return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(clientSearch.toLowerCase()),
    );
  }, [options, clientSearch, mode]);

  const handleSearchChange = (text: string) => {
    if (mode === "server") {
      onSearchChange?.(text);
    } else {
      setClientSearch(text);
    }
  };

  const handleClose = () => {
    if (mode === "server") {
      onSearchChange?.("");
    } else {
      setClientSearch("");
    }
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        {...props}
        {...field}
        labelId={labelId}
        label={label}
        value={field?.value ?? ""}
        onChange={field?.onChange}
        onClose={handleClose}
        MenuProps={{ autoFocus: false }}
      >
        <ListSubheader sx={{ px: 1, pt: 1, pb: 0.5 }}>
          <BaseTextField
            autoFocus
            size="small"
            fullWidth
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            sx={{
              "& .MuiInputBase-root": { height: 36, borderRadius: 2 },
              "& .MuiInputBase-input": { py: 0, fontSize: "0.8125rem" },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </ListSubheader>
        {options.length === 0 ? (
          <MenuItem disabled>Không có dữ liệu</MenuItem>
        ) : filteredOptions.length === 0 ? (
          <MenuItem disabled>Không tìm thấy kết quả</MenuItem>
        ) : (
          filteredOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        )}
        {isLoadMore && (
          <MenuItem
            onClickCapture={(e) => {
              e.stopPropagation();
              onLoadMore?.();
            }}
            sx={{
              justifyContent: "center",
              color: "primary.main",
              fontSize: "0.8125rem",
              fontWeight: 500,
              py: 0.75,
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={16} aria-label="Loading…" />
            ) : (
              "Xem thêm"
            )}
          </MenuItem>
        )}
      </Select>
      {hasError && <FormHelperText>{fieldError.message}</FormHelperText>}
    </FormControl>
  );
};

export default BaseSingleSelect;
