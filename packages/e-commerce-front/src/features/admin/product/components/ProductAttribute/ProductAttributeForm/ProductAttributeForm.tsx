import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import SelectAttribute from "@/components/inputs/SelectAttribute/SelectAttribute";
import type {
  PatchProductAttributeBody,
  PostProductAttributeBody,
} from "@e-commerce/api-validation/types/product";
import Grid from "@mui/material/Grid";
import { useFormContext } from "react-hook-form";

type ProductAttributeType =
  | PostProductAttributeBody
  | PatchProductAttributeBody;

const ProductAttributeForm = () => {
  const { control } = useFormContext<ProductAttributeType>();
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <SuspenseWrapper height={40}>
          <SelectAttribute
            control={control}
            name="attributeId"
            label="Thuộc tính"
          />
        </SuspenseWrapper>
      </Grid>
    </Grid>
  );
};

export default ProductAttributeForm;
