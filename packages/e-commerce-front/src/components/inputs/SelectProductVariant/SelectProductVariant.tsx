import ProductVariantPickerDialog from "@/components/inputs/SelectProductVariant/components/ProductVariantPickerDialog/ProductVariantPickerDialog";
import { useGetProductVariantsSuspense } from "@e-commerce/api-client/endpoints/product";
import type { ProductVariantResponse } from "@e-commerce/api-client/schemas/product";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import { useMemo, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type SelectProductVariantProps<TField extends FieldValues> = {
  control: Control<TField>;
  name: Path<TField>;
  label: string;
};

const SelectProductVariant = <TField extends FieldValues>({
  control,
  name,
  label,
}: SelectProductVariantProps<TField>) => {
  const { data: allVariantsData } = useGetProductVariantsSuspense();
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantResponse>();
  const [selectedProductName, setSelectedProductName] = useState<string>();

  const variantMap = useMemo(
    () =>
      new Map(
        allVariantsData.productVariants.map((variant) => [
          variant.productVariantId,
          variant,
        ]),
      ),
    [allVariantsData.productVariants],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentVariant = variantMap.get(field.value);
        const displayValue = selectedVariant
          ? `${selectedProductName ?? "Sản phẩm"} - ${selectedVariant.sku}`
          : currentVariant?.sku || "";

        return (
          <>
            <MuiTextField
              label={label}
              value={displayValue}
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        startIcon={<SearchIcon />}
                        onClick={() => {
                          const nextVariant = variantMap.get(field.value);
                          setSelectedVariant(nextVariant);
                          setOpen(true);
                        }}
                      >
                        Chọn
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {open && (
              <ProductVariantPickerDialog
                open={open}
                initialProductId={selectedVariant?.productId}
                onClose={() => setOpen(false)}
                onConfirm={(variant, productName) => {
                  setSelectedVariant(variant);
                  setSelectedProductName(productName);
                  field.onChange(variant.productVariantId);
                  setOpen(false);
                }}
              />
            )}
          </>
        );
      }}
    />
  );
};

export default SelectProductVariant;
