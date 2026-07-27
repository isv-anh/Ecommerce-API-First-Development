"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export const CheckoutEmptyState = () => {
  return (
    <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
      <Typography variant="header" mb={1} sx={{ fontWeight: 700 }}>
        Không có sản phẩm để thanh toán
      </Typography>
      <Typography variant="regularS" color="text.secondary" mb={4} sx={{ display: "block" }}>
        Giỏ hàng của bạn đang trống.
      </Typography>
      <Link href="/product">
        <Button variant="contained" startIcon={<ArrowBackIcon />}>
          Quay lại cửa hàng
        </Button>
      </Link>
    </Paper>
  );
};
