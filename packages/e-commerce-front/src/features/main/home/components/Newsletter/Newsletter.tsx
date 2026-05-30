"use client";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof schema>;

const Newsletter = () => {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    // For now just show console (mock). In production wire to API.
    console.log("subscribe", values);
    alert("Cảm ơn bạn đã đăng ký!");
  };

  return (
    <Box
      component="section"
      sx={{ width: "100%", px: { xs: 2, md: 6 }, py: 4 }}
    >
      <Typography variant="header" sx={{ mb: 1 }}>
        Đăng ký nhận tin
      </Typography>
      <Typography variant="regularS" sx={{ mb: 2, color: "text.secondary" }}>
        Nhận mã giảm giá và cập nhật sản phẩm mới nhất.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Email" {...register("email")} />
          <Button type="submit" variant="contained" color="primary">
            Đăng ký
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Newsletter;
