import type {
  PatchProductVariantBody,
  PostProductVariantBody,
} from "@e-commerce/api-validation/types/product";
import Grid from "@mui/material/Grid";
import { useFormContext } from "react-hook-form";

type VariantFormType = PostProductVariantBody | PatchProductVariantBody;

const VariantForm = () => {
  const { control } = useFormContext<VariantFormType>();
  return <Grid container spacing={2}></Grid>;
};

export default VariantForm;
