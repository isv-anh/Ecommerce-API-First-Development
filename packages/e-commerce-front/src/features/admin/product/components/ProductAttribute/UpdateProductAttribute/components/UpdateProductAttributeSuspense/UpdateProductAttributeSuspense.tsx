import ProductAttributeForm from "@/features/admin/product/components/ProductAttribute/ProductAttributeForm/ProductAttributeForm";
import { useGetProductAttributeByIdSuspense } from "@e-commerce/api-client/endpoints/product";
import type { PatchProductAttributeBody } from "@e-commerce/api-validation/types/product";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const UpdateProductAttributeSuspense = ({
  id,
}: {
  id: {
    attributeId: string;
    productId: string;
  };
}) => {
  const { data } = useGetProductAttributeByIdSuspense(
    id.productId,
    id.attributeId,
  );

  const { reset } = useFormContext<PatchProductAttributeBody>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return <ProductAttributeForm />;
};

export default UpdateProductAttributeSuspense;
