import VariantForm from "@/features/admin/product/components/ProductVariant/VariantForm/VariantForm";
import { useGetProductVariantByIdSuspense } from "@e-commerce/api-client/endpoints/product";
import type { PatchProductVariantBody } from "@e-commerce/api-validation/types/product";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const UpdateVariantSuspense = ({
  productVariantId,
}: {
  productVariantId: string;
}) => {
  const { data } = useGetProductVariantByIdSuspense(productVariantId);
  const { reset } = useFormContext<PatchProductVariantBody>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);
  return <VariantForm />;
};

export default UpdateVariantSuspense;
