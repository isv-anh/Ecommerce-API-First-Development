import SubmitDialog from "@/components/feedback/SubmitDialog/SubmitDialog";
import ProductAttributeForm from "@/features/admin/product/components/ProductAttribute/ProductAttributeForm/ProductAttributeForm";
import {
  getGetProductAttributesQueryKey,
  usePostProductAttribute,
} from "@e-commerce/api-client/endpoints/product";
import type { PostProductAttributeBody } from "@e-commerce/api-validation/types/product";
import { postProductAttributeBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const CreateProductAttribute = ({
  productId,
  open,
  onClose,
}: {
  productId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const methods = useForm<PostProductAttributeBody>({
    resolver: zodResolver(postProductAttributeBody),
    defaultValues: {
      productId,
    },
  });

  const queryClient = useQueryClient();

  const postProductAttribute = usePostProductAttribute();

  const onSubmit = async (data: PostProductAttributeBody) => {
    try {
      await postProductAttribute.mutateAsync({
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetProductAttributesQueryKey(),
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
        onClose={onClose}
        onSubmit={methods.handleSubmit(onSubmit)}
        title="Thêm thuộc tính sản phẩm"
        width={300}
      >
        <ProductAttributeForm />
      </SubmitDialog>
    </FormProvider>
  );
};

export default CreateProductAttribute;
