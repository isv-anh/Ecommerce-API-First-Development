"use client";

import React from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Link from "next/link";
import { useGetOrderByIdSuspense } from "@e-commerce/api-client/endpoints/order";
import SuspenseWrapper from "@/components/feedback/SuspenseWrapper/SuspenseWrapper";
import { routes } from "@/utils/pathMap";
import {
  formatVND,
  ORDER_STEPS,
  getActiveStep,
  getStatusChip,
} from "./components/orderUtils";
import { OrderItemsTable } from "./components/OrderItemsTable";
import { OrderPaymentsSection } from "./components/OrderPaymentsSection";

const OrderDetailContent = ({ orderId }: { orderId: string }) => {
  const { data: order } = useGetOrderByIdSuspense(orderId);
  const activeStep = getActiveStep(order.status);
  const isCancelled = order.status?.toUpperCase() === "CANCELLED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <Paper
        elevation={0}
        className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-slate-900">
                Đơn hàng #{order.orderId}
              </h2>
              {getStatusChip(order.status)}
            </div>
            <p className="text-xs text-slate-500">
              Ngày đặt hàng:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("vi-VN")
                : "-"}
            </p>
          </div>
        </div>

        {!isCancelled && (
          <div className="mt-8 mb-2">
            <Stepper activeStep={activeStep} alternativeLabel>
              {ORDER_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        )}
      </Paper>

      {/* Grid Content: Items & Price Breakdown */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs"
          >
            <h3 className="font-bold text-slate-900 text-base mb-4">
              Sản phẩm đã đặt
            </h3>
            <SuspenseWrapper height={150}>
              <OrderItemsTable orderId={orderId} />
            </SuspenseWrapper>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <SuspenseWrapper height={150}>
                <OrderPaymentsSection
                  orderId={orderId}
                  totalAmount={order.finalAmount}
                />
              </SuspenseWrapper>
            </div>
          </Paper>
        </Grid>

        {/* Right Summary Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-4">
              <ReceiptLongIcon className="text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Tổng kết đơn hàng
              </h3>
            </div>

            <Divider className="mb-4 border-slate-200" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính:</span>
                <span className="font-semibold text-slate-900">
                  {formatVND(order.totalAmount)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Giảm giá:</span>
                <span className="font-semibold text-red-500">
                  -{formatVND(order.totalDiscount)}
                </span>
              </div>

              <Divider className="my-2 border-slate-200 border-dashed" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-slate-900">
                  Tổng thanh toán:
                </span>
                <span className="font-black text-2xl text-indigo-600">
                  {formatVND(order.finalAmount)}
                </span>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export const UserOrderDetail = ({ orderId }: { orderId: string }) => {
  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href={routes.me.order.list}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            size="small"
            className="rounded-xl normal-case font-semibold text-xs"
          >
            Danh sách đơn hàng
          </Button>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">
          Chi tiết đơn hàng
        </h1>
      </div>

      <SuspenseWrapper height={400}>
        <OrderDetailContent orderId={orderId} />
      </SuspenseWrapper>
    </Container>
  );
};
