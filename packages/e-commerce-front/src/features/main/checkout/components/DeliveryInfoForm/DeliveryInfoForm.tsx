"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useFormContext } from "react-hook-form";
import type { CheckoutFormValues } from "../../Checkout";

export const DeliveryInfoForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  return (
    <Paper
      elevation={0}
      className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Stack direction="row" alignItems="center" spacing={1.5} className="mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <LocalShippingIcon className="text-indigo-600" />
        </div>
        <div>
          <Typography variant="boldL" className="text-slate-900 font-bold text-lg">
            Thông tin giao hàng
          </Typography>
          <Typography variant="regularXs" className="text-slate-500 block text-xs">
            Vui lòng nhập chính xác địa chỉ để chúng tôi giao hàng đúng hẹn
          </Typography>
        </div>
      </Stack>

      <Stack spacing={2.5}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Họ và tên người nhận"
              required
              fullWidth
              className="bg-slate-50/50 rounded-xl"
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Số điện thoại"
              required
              fullWidth
              className="bg-slate-50/50 rounded-xl"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <TextField
          label="Địa chỉ nhận hàng (Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP)"
          required
          fullWidth
          multiline
          rows={2}
          className="bg-slate-50/50 rounded-xl"
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message}
        />
        <TextField
          label="Ghi chú cho đơn hàng (Không bắt buộc)"
          fullWidth
          multiline
          rows={2}
          className="bg-slate-50/50 rounded-xl"
          {...register("note")}
          error={!!errors.note}
          helperText={errors.note?.message}
        />
      </Stack>
    </Paper>
  );
};
