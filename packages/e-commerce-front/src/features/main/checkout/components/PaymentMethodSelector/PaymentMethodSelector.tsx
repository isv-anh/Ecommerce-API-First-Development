"use client";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useFormContext, Controller } from "react-hook-form";
import type { CheckoutFormValues } from "../../Checkout";

export const PaymentMethodSelector = () => {
  const { control } = useFormContext<CheckoutFormValues>();

  const methods = [
    {
      id: "COD",
      title: "Thanh toán khi nhận hàng (COD)",
      desc: "Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận được hàng.",
      icon: <LocalAtmIcon className="text-emerald-600" />,
      color: "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/30",
    },
    {
      id: "BANK_TRANSFER",
      title: "Chuyển khoản ngân hàng (QR Code)",
      desc: "Chuyển khoản nhanh qua quét mã VietQR ngân hàng 24/7.",
      icon: <QrCode2Icon className="text-blue-600" />,
      color: "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/30",
    },
    {
      id: "CREDIT_CARD",
      title: "Thẻ quốc tế (Visa / Mastercard)",
      desc: "Thanh toán an toàn qua cổng thẻ Visa / Mastercard / JCB.",
      icon: <CreditCardIcon className="text-indigo-600" />,
      color: "border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/30",
    },
    {
      id: "E_WALLET",
      title: "Ví điện tử (MoMo / VNPay)",
      desc: "Thanh toán qua ví điện tử MoMo hoặc ZaloPay / VNPay.",
      icon: <AccountBalanceWalletIcon className="text-fuchsia-600" />,
      color: "border-fuchsia-500 bg-fuchsia-50/40 ring-1 ring-fuchsia-500/30",
    },
  ];

  return (
    <Paper
      elevation={0}
      className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Stack direction="row" alignItems="center" spacing={1.5} className="mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <PaymentIcon className="text-purple-600" />
        </div>
        <div>
          <Typography
            variant="boldL"
            className="text-slate-900 font-bold text-lg"
          >
            Phương thức thanh toán
          </Typography>
          <Typography
            variant="regularXs"
            className="text-slate-500 block text-xs"
          >
            Chọn hình thức thanh toán phù hợp nhất với bạn
          </Typography>
        </div>
      </Stack>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="space-y-3"
          >
            {methods.map((m) => {
              const isSelected = value === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => onChange(m.id)}
                  className={`flex items-start p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? m.color
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <FormControlLabel
                    value={m.id}
                    control={<Radio color="primary" size="small" />}
                    className="mr-2 mt-0.5"
                    label=""
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {m.icon}
                      <span className="font-bold text-slate-800 text-sm">
                        {m.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        )}
      />
    </Paper>
  );
};
