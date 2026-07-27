import Chip from "@mui/material/Chip";

export const SHORT_ID_LENGTH = 8;

export const formatVND = (value: number | undefined) => {
  if (value === undefined || value === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const ORDER_STEPS = [
  "Chờ xử lý",
  "Đã xác nhận",
  "Đang giao hàng",
  "Hoàn thành",
];

export const getActiveStep = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
      return 1;
    case "SHIPPING":
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return 2;
    case "COMPLETED":
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return 3;
    default:
      return 0;
  }
};

export const getStatusChip = (status: string) => {
  const upper = status?.toUpperCase();
  switch (upper) {
    case "PENDING":
      return (
        <Chip
          label="Chờ xử lý"
          color="warning"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "CONFIRMED":
      return (
        <Chip
          label="Đã xác nhận"
          color="info"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "SHIPPING":
      return (
        <Chip
          label="Đang giao hàng"
          color="primary"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "COMPLETED":
      return (
        <Chip
          label="Hoàn thành"
          color="success"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    case "CANCELLED":
      return (
        <Chip
          label="Đã hủy"
          color="error"
          size="small"
          className="font-bold text-xs shadow-xs"
        />
      );
    default:
      return (
        <Chip
          label={status || "Không xác định"}
          color="default"
          size="small"
          className="font-bold text-xs"
        />
      );
  }
};
