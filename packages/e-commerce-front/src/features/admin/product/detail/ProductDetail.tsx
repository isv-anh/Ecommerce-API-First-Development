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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "@/components/feedback/ConfirmDialog/ConfirmDialog";
import { DELETE_MESSAGE } from "@/components/feedback/SubmitDialog/constants/message";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import ProductVariantGrid from "@/features/admin/product/components/ProductVariant/ProductVariantGrid/ProductVariantGrid";
import SectionLayout from "@/components/layouts/SectionLayout/SectionLayout";
import ProductAttributeGrid from "@/features/admin/product/components/ProductAttribute/ProductAttributeGrid/ProductAttributeGrid";

const ProductDetail = ({ productId }: { productId: string }) => {
  const methods = useForm<PatchProductBody>({
    resolver: zodResolver(patchProductBody),
    defaultValues: {
      images: [],
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const { enqueueSnackbar } = useSnackbar();

  const patchProduct = usePatchProduct();

  const queryProductById = useGetProductByProductIdSuspense(productId);

  const deleteProduct = useDeleteProduct();

  const queryClient = useQueryClient();

  const { setFabs, clear } = useFabs();

  const router = useRouter();

  const submitRef = useRef<HTMLButtonElement | null>(null);

  const { reset } = methods;

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      await deleteProduct.mutateAsync({ productId });
      queryClient.invalidateQueries({
        queryKey: getGetProductsQueryKey(),
      });

      enqueueSnackbar({
        message: "Sản phẩm đã được xóa",
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
  };

  useEffect(() => {
    reset(queryProductById.data);
  }, [queryProductById.data, reset]);

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
        label: "Cập nhật",
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
        <Stack spacing={2}>
          <ProductForm />
          <SectionLayout title="Thuộc tính sản phẩm">
            <SuspenseWrapper height={200}>
              <ProductAttributeGrid productId={productId} />
            </SuspenseWrapper>
          </SectionLayout>
          <SectionLayout title="Phân loại sản phẩm">
            <SuspenseWrapper height={200}>
              <ProductVariantGrid productId={productId} />
            </SuspenseWrapper>
          </SectionLayout>

          <Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Xóa
            </Button>
          </Box>
        </Stack>
        <Button type="submit" ref={submitRef} sx={{ display: "none" }}></Button>
        <Backdrop open={patchProduct.isPending || deleteProduct.isPending}>
          <CircularProgress />
        </Backdrop>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        title="Xác nhận xóa"
        message={DELETE_MESSAGE}
        confirmButtonColor="error"
        confirmButtonVariant="contained"
        confirmButtonTitle="Xóa"
      />
    </FormProvider>
  );
};

export default ProductDetail;
