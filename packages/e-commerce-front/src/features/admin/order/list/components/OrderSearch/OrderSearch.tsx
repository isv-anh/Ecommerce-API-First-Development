"use client";
import SingleSelect from "@/components/inputs/SingleSelect/SingleSelect";
import TextField from "@/components/inputs/TextField/TextField";
import { orderSearchContext } from "@/features/admin/order/list/utils";
import type { GetOrdersQueryParams } from "@e-commerce/api-validation/types/order";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý (Pending)" },
  { value: "confirmed", label: "Đã xác nhận (Confirmed)" },
  { value: "shipping", label: "Đang giao hàng (Shipping)" },
  { value: "completed", label: "Hoàn thành (Completed)" },
  { value: "cancelled", label: "Đã hủy (Cancelled)" },
];

type SearchFormValues = Partial<GetOrdersQueryParams>;

const OrderSearch = () => {
  const { params, setParams } = orderSearchContext.useSearch();
  const defaultValues: SearchFormValues = {
    userId: "",
    status: "",
  };

  const { reset, control, handleSubmit } = useForm<SearchFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(params);
  }, [params, reset]);

  const onSubmit = (data: SearchFormValues) => {
    const cleanParams: Partial<GetOrdersQueryParams> = {};
    if (data.userId) cleanParams.userId = data.userId;
    if (data.status) cleanParams.status = data.status;
    setParams(cleanParams);
  };

  return (
    <Box p={3} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            control={control}
            name="userId"
            label="Mã người dùng (User ID)"
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SingleSelect
            control={control}
            name="status"
            label="Trạng thái đơn hàng"
            options={ORDER_STATUS_OPTIONS}
            fullWidth
          />
        </Grid>

        <Grid size={12} />
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                reset(defaultValues);
                setParams({});
              }}
            >
              Đặt lại
            </Button>
            <Button variant="contained" type="submit">
              Tìm kiếm
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSearch;
