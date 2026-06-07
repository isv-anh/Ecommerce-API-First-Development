"use client";

import useFabs from "@/components/inputs/Fabs/provider/hooks/useFabs";
import ProductForm from "@/features/admin/product/components/ProductForm/ProductForm";
import { routes } from "@/utils/pathMap";
import {
  getGetProductsQueryKey,
  useDeleteProduct,
  useGetProductByProductIdSuspense,
  usePatchProduct,
} from "@e-commerce/api-client/endpoints/product";
import type { PatchProductBody } from "@e-commerce/api-validation/types/product";
import { patchProductBody } from "@e-commerce/api-validation/zod/product";
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

const ProductDetail = ({ productId }: { productId: string }) => {
  const methods = useForm<PatchProductBody>({
    resolver: zodResolver(patchProductBody),
    defaultValues: {
      images: [],
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const patchProduct = usePatchProduct();

  const queryProductById = useGetProductByProductIdSuspense(productId);

  const deleteProduct = useDeleteProduct();

  const queryClient = useQueryClient();

  const { setFabs, clear } = useFabs();

  const router = useRouter();

  const submitRef = useRef<HTMLButtonElement | null>(null);

  const { reset } = methods;

  const onSubmit = useCallback(
    async (data: PatchProductBody) => {
      console.log("data", typeof data);
      try {
        await patchProduct.mutateAsync({
          productId,
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

        router.push(routes.admin.product.list);
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
    [enqueueSnackbar, patchProduct, productId, queryClient, router],
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
        <Backdrop open={patchProduct.isPending}>
          <CircularProgress />
        </Backdrop>
      </Paper>
    </FormProvider>
  );
};

export default ProductDetail;
