import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import VariantForm from "@/features/admin/product/components/ProductVariant/VariantForm/VariantForm";
import {
  getGetProductVariantsQueryKey,
  useGetProductAttributesSuspense,
  usePostProductVariant,
} from "@e-commerce/api-client/endpoints/product";
import type { VariantAttribute } from "@e-commerce/api-client/schemas/product";
import type { PostProductVariantBody } from "@e-commerce/api-validation/types/product";
import { postProductVariantBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

const CreateVariant = ({
  productId,
  open,
  onClose,
}: {
  productId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { data } = useGetProductAttributesSuspense({
    productId,
  });

  const variantAttributes: VariantAttribute[] = useMemo(() => {
    return data.productAttributes.map((attr) => ({
      attributeId: attr.attributeId,
      attributeName: attr.attributeName,
      attributeValue: "",
    }));
  }, [data.productAttributes]);

  const methods = useForm<PostProductVariantBody>({
    resolver: zodResolver(postProductVariantBody),
    defaultValues: {
      productId,
      variantAttributes: variantAttributes,
    },
  });

  const queryClient = useQueryClient();

  const postVariant = usePostProductVariant();

  const onSubmit = async (data: PostProductVariantBody) => {
    try {
      await postVariant.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductVariantsQueryKey(),
      });
      methods.reset({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <SubmitDialog
        open={open}
        onClose={() => {
          onClose();
        }}
        onSubmit={methods.handleSubmit(onSubmit, (err) => console.log(err))}
        title="Thêm phân loại sản phẩm"
        width={500}
      >
        <VariantForm />
      </SubmitDialog>
    </FormProvider>
  );
};

export default CreateVariant;
