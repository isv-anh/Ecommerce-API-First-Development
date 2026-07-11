import UploadImageViewer from "@/components/data-display/UploadImageViewer/UploadImageViewer";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import ImagePicker from "@/components/inputs/ImagePicker/ImagePicker";
import SelectBrand from "@/components/inputs/SelectBrand/SelectBrand";
import SelectCategory from "@/components/inputs/SelectCategory/SelectCategory";

import TextField from "@/components/inputs/TextField/TextField";
import SectionLayout from "@/components/layouts/SectionLayout/SectionLayout";
import type { ProductFormType } from "@/features/admin/product/components/ProductForm/types";
import useUpload from "@/hooks/useUpload";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import dynamic from "next/dynamic";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

const RichTextEditor = dynamic(
  () => import("@/components/inputs/RichTextEditor/RichTextEditor"),
  {
    ssr: false,
  },
);

const ProductForm = () => {
  const { control, setError, setValue } = useFormContext<ProductFormType>();

  const thumbnailWatch = useWatch({ control, name: "thumbnailUrl" });

  const { fields, remove, append } = useFieldArray({ control, name: "images" });

  const { handleUpload } = useUpload();
  return (
    <Grid container spacing={2}>
      <SectionLayout title="Thông tin sản phẩm">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              required
              label="Tên sản phẩm"
              control={control}
              name="productName"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              required
              label="Slug"
              control={control}
              name="slug"
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 0, md: 6 }}></Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <SuspenseWrapper height={40}>
              <SelectCategory
                control={control}
                name="categoryId"
                label="Danh mục"
              />
            </SuspenseWrapper>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <SuspenseWrapper height={40}>
              <SelectBrand
                control={control}
                name="brandId"
                label="Thương hiệu"
              />
            </SuspenseWrapper>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", alignItems: "center" }}>
            <Controller
              control={control}
              name="isPublished"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Xuất bản sản phẩm"
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography>Ảnh đại diện:</Typography>

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

          <Grid size={12}>
            <Box>
              <Typography mb={2}>Hình ảnh sản phẩm:</Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                {fields.map((field, index) => (
                  <Box key={field.id} width={100} height={100} flexShrink={0}>
                    <UploadImageViewer
                      url={field.url}
                      onDelete={() => {
                        remove(index);
                      }}
                    />
                  </Box>
                ))}

                <Box width={100} height={100} flexShrink={0}>
                  <Controller
                    control={control}
                    name="images"
                    render={({ field, fieldState }) => {
                      return (
                        <ImagePicker
                          multiple
                          field={field}
                          fieldError={fieldState.error}
                          setImages={(urls) => {
                            urls.forEach((url) => {
                              append({ url });
                            });
                          }}
                        />
                      );
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </SectionLayout>

      <Grid size={12}>
        <SectionLayout title="Mô tả sản phẩm">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                onImageUpload={handleUpload}
              />
            )}
          />
        </SectionLayout>
      </Grid>
    </Grid>
  );
};

export default ProductForm;
