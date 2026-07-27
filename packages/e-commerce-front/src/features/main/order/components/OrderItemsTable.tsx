"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useGetOrderItemsSuspense } from "@e-commerce/api-client/endpoints/order";
import { formatVND } from "./orderUtils";

export const OrderItemsTable = ({ orderId }: { orderId: string }) => {
  const { data } = useGetOrderItemsSuspense(orderId);
  const items = data.orderItems || [];

  if (items.length === 0) {
    return (
      <p className="text-xs text-slate-500 italic p-3">
        Không có sản phẩm nào trong đơn hàng.
      </p>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="rounded-xl border border-slate-200 overflow-hidden"
    >
      <Table size="medium">
        <TableHead className="bg-slate-50">
          <TableRow>
            <TableCell className="font-bold text-slate-700 text-xs">
              Sản phẩm
            </TableCell>
            <TableCell className="font-bold text-slate-700 text-xs">
              Biến thể
            </TableCell>
            <TableCell
              align="right"
              className="font-bold text-slate-700 text-xs"
            >
              Đơn giá
            </TableCell>
            <TableCell
              align="right"
              className="font-bold text-slate-700 text-xs"
            >
              Số lượng
            </TableCell>
            <TableCell
              align="right"
              className="font-bold text-slate-700 text-xs"
            >
              Thành tiền
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y divide-slate-100">
          {items.map((item) => (
            <TableRow key={item.orderItemId} className="hover:bg-slate-50/50">
              <TableCell className="font-semibold text-slate-900 text-xs">
                {item.productName}
              </TableCell>
              <TableCell className="text-slate-500 text-xs">
                {item.variantName || "-"}
              </TableCell>
              <TableCell align="right" className="text-xs">
                {formatVND(item.price)}
              </TableCell>
              <TableCell align="right" className="font-medium text-xs">
                {item.quantity}
              </TableCell>
              <TableCell
                align="right"
                className="font-bold text-indigo-600 text-xs"
              >
                {formatVND(item.totalPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
