"use client";

import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PaymentIcon from "@mui/icons-material/Payment";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPaymentsSuspense,
  usePostPayment,
  getGetOrderByIdQueryKey,
  getGetPaymentsQueryKey,
} from "@e-commerce/api-client/endpoints/order";
import { formatVND, getStatusChip, SHORT_ID_LENGTH } from "./orderUtils";

export const OrderPaymentsSection = ({
  orderId,
  totalAmount,
}: {
  orderId: string;
  totalAmount: number;
}) => {
  const { data } = useGetPaymentsSuspense(orderId);
  const payments = data.payments || [];
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const postPaymentMutation = usePostPayment();

  const handleMakePayment = async () => {
    try {
      await postPaymentMutation.mutateAsync({
        orderId,
        data: {
          method: selectedMethod,
          amount: totalAmount,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getGetPaymentsQueryKey(orderId),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetOrderByIdQueryKey(orderId),
      });
      enqueueSnackbar("Tạo lịch sử thanh toán thành công!", {
        variant: "success",
      });
      setPaymentDialogOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error?.message || "Lỗi khi xử lý thanh toán", {
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base">
          Lịch sử thanh toán
        </h3>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PaymentIcon />}
          onClick={() => setPaymentDialogOpen(true)}
          className="rounded-xl normal-case font-semibold text-xs"
        >
          Thêm thanh toán mới
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Chưa ghi nhận lịch sử thanh toán nào cho đơn hàng này.
          </p>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          className="rounded-xl border border-slate-200 overflow-hidden"
        >
          <Table size="small">
            <TableHead className="bg-slate-50">
              <TableRow>
                <TableCell className="font-bold text-slate-700 text-xs">
                  Phương thức
                </TableCell>
                <TableCell className="font-bold text-slate-700 text-xs">
                  Trạng thái
                </TableCell>
                <TableCell
                  align="right"
                  className="font-bold text-slate-700 text-xs"
                >
                  Số tiền
                </TableCell>
                <TableCell
                  align="right"
                  className="font-bold text-slate-700 text-xs"
                >
                  Ngày tạo
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <TableRow key={p.paymentId}>
                  <TableCell className="font-semibold text-slate-800 text-xs">
                    {p.method}
                  </TableCell>
                  <TableCell>{getStatusChip(p.status)}</TableCell>
                  <TableCell
                    align="right"
                    className="font-bold text-slate-900 text-xs"
                  >
                    {formatVND(p.amount)}
                  </TableCell>
                  <TableCell align="right" className="text-slate-500 text-xs">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString("vi-VN")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment Selection Modal */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold text-base">
          Thực hiện thanh toán
        </DialogTitle>
        <DialogContent>
          <p className="text-xs text-slate-500 mb-3">
            Chọn phương thức thanh toán cho đơn hàng #
            {orderId.slice(0, SHORT_ID_LENGTH)}...
          </p>
          <RadioGroup
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <FormControlLabel
              value="COD"
              control={<Radio size="small" />}
              label={
                <span className="text-xs font-medium">
                  Thanh toán khi nhận hàng (COD)
                </span>
              }
            />
            <FormControlLabel
              value="BANK_TRANSFER"
              control={<Radio size="small" />}
              label={
                <span className="text-xs font-medium">
                  Chuyển khoản QR Ngân hàng
                </span>
              }
            />
            <FormControlLabel
              value="CREDIT_CARD"
              control={<Radio size="small" />}
              label={
                <span className="text-xs font-medium">
                  Thẻ quốc tế (Visa/Mastercard)
                </span>
              }
            />
            <FormControlLabel
              value="E_WALLET"
              control={<Radio size="small" />}
              label={
                <span className="text-xs font-medium">
                  Ví điện tử MoMo / VNPay
                </span>
              }
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions className="p-3">
          <Button
            onClick={() => setPaymentDialogOpen(false)}
            color="inherit"
            className="normal-case text-xs"
          >
            Hủy
          </Button>
          <Button
            onClick={handleMakePayment}
            variant="contained"
            disabled={postPaymentMutation.isPending}
            className="normal-case text-xs font-bold bg-indigo-600"
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
