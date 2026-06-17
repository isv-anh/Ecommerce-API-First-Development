import UploadImageViewer from "@/components/data-display/UploadImageViewer/UploadImageViewer";
import CurrencyField from "@/components/inputs/CurrencyField/CurrencyField";
import ImagePicker from "@/components/inputs/ImagePicker/ImagePicker";
import TextField from "@/components/inputs/TextField/TextField";
import type {
  PatchProductVariantBody,
  PostProductVariantBody,
} from "@e-commerce/api-validation/types/product";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

type VariantFormType = PostProductVariantBody | PatchProductVariantBody;

const VariantForm = () => {
  const { control, setValue, setError } = useFormContext<VariantFormType>();

  const thumbnailWatch = useWatch({ control, name: "thumbnailUrl" });

  const { fields } = useFieldArray({ control, name: "variantAttributes" });

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField control={control} name="sku" label="SKU" required />
      </Grid>
      <Grid size={6}>
        <CurrencyField
          control={control}
          name="price"
          label="Giá bán"
          required
        />
      </Grid>
      <Grid size={6}>
        <CurrencyField
          control={control}
          name="comparePrice"
          label="Giá so sánh"
          required
        />
      </Grid>

      <Grid size={12}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Hình ảnh:</Typography>

          {thumbnailWatch ? (
            <UploadImageViewer
              url={thumbnailWatch}
              onDelete={() => setValue("thumbnailUrl", null)}
            />
          ) : (
            <Controller
              control={control}
              name="thumbnailUrl"
              render={({ field, fieldState }) => (
                <ImagePicker
                  field={field}
                  fieldError={fieldState.error}
                  setError={setError}
                />
              )}
            />
          )}
        </Box>
      </Grid>

      {fields.map((field, index) => {
        return (
          <Grid size={6} key={field.id}>
            <TextField
              control={control}
              name={`variantAttributes.${index}.attributeValue`}
              label={field.attributeName}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default VariantForm;
