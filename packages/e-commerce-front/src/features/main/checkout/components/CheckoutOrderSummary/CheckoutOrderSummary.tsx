"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { CheckoutItemRow } from "../../CheckoutItemRow";
import type { ResolvedCheckoutItem } from "../../CheckoutItemRow";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

interface CheckoutOrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  submitting: boolean;
  onItemResolved: (item: ResolvedCheckoutItem) => void;
}

export const CheckoutOrderSummary = ({
  cartItems,
  subtotal,
  shippingFee,
  totalAmount,
  submitting,
  onItemResolved,
}: CheckoutOrderSummaryProps) => {
  return (
    <Paper
      elevation={0}
      className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-sm sticky top-24 backdrop-blur-sm"
    >
      <Stack direction="row" alignItems="center" spacing={1.5} className="mb-4">
        <div className="flex h-10 w-10 alignItems-center justify-center rounded-xl bg-indigo-100/80 text-indigo-700">
          <ReceiptLongIcon className="text-indigo-600" />
        </div>
        <div>
          <Typography variant="boldL" className="text-slate-900 font-bold text-lg">
            Tóm tắt đơn hàng
          </Typography>
          <span className="text-xs text-slate-500 font-medium">{cartItems.length} sản phẩm trong đơn</span>
        </div>
      </Stack>

      <Divider className="mb-3 border-slate-200" />

      {/* Cart Items List */}
      <div className="max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
        {cartItems.map((item) => (
          <React.Suspense
            key={item.productVariantId}
            fallback={
              <Box py={1} textAlign="center">
                <CircularProgress size={20} />
              </Box>
            }
          >
            <CheckoutItemRow item={item} onResolved={onItemResolved} />
          </React.Suspense>
        ))}
      </div>

      <Divider className="my-4 border-slate-200" />

      {/* Financial Details */}
      <Stack spacing={2} className="text-sm">
        <div className="flex justify-between items-center text-slate-600">
          <span>Tạm tính:</span>
          <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold">
            {shippingFee === 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                Miễn phí
              </span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        <Divider className="my-1 border-dashed border-slate-200" />

        <div className="flex justify-between items-baseline pt-1">
          <span className="font-bold text-slate-900 text-base">Tổng thanh toán:</span>
          <span className="font-extrabold text-2xl text-indigo-600 tracking-tight">
            {formatPrice(totalAmount)}
          </span>
        </div>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          className="w-full py-3.5 mt-4 font-bold text-base rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-200 normal-case"
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Xác nhận đặt hàng"}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-2">
          <ShieldOutlinedIcon className="text-emerald-600 text-base" />
          <span>Bảo mật thông tin & cam kết hoàn tiền 100%</span>
        </div>
      </Stack>
    </Paper>
  );
};
