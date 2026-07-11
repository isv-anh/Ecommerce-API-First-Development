"use client";

import useFabs from "@/components/inputs/Fabs/provider/hooks/useFabs";
import ProductForm from "@/features/admin/product/components/ProductForm/ProductForm";
import { routes } from "@/utils/pathMap";
import {
  getGetProductsQueryKey,
  usePostProduct,
} from "@e-commerce/api-client/endpoints/product";
import type { PostProductBody } from "@e-commerce/api-validation/types/product";
import { postProductBody } from "@e-commerce/api-validation/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

const ProductNew = () => {
  const methods = useForm<PostProductBody>({
    resolver: zodResolver(postProductBody),
    defaultValues: {
      images: [],
      isPublished: false,
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const postProduct = usePostProduct();

  const queryClient = useQueryClient();

  const { setFabs, clear } = useFabs();

  const router = useRouter();

  const submitRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = useCallback(
    async (data: PostProductBody) => {
      console.log("data", typeof data);
      try {
        const response = await postProduct.mutateAsync({
          data,
        });

        queryClient.invalidateQueries({
          queryKey: getGetProductsQueryKey(),
        });

        enqueueSnackbar({
          message: "Thêm sản phẩm thành công",
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "success",
        });

        router.push(routes.admin.product.detail(response.productId));
      } catch (error) {
        enqueueSnackbar({
          message: (error as Error).message,
          anchorOrigin: {
            horizontal: "right",
            vertical: "top",
          },
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, postProduct, queryClient, router],
  );

  useEffect(() => {
    setFabs([
      { type: "back", href: routes.admin.product.list },
      {
        type: "button",
        label: "Lưu sản phẩm",
        onClick: () => submitRef.current?.click(),
      },
    ]);

    return () => {
      clear();
    };
  }, [clear, setFabs]);

  return (
    <FormProvider {...methods}>
      <Paper
        component={"form"}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        sx={{
          p: 3,
          minHeight: "calc(100vh - 145px)",
        }}
      >
        <ProductForm />
        <Button type="submit" ref={submitRef} sx={{ display: "none" }}></Button>
        <Backdrop open={postProduct.isPending}>
          <CircularProgress />
        </Backdrop>
      </Paper>
    </FormProvider>
  );
};

export default ProductNew;
