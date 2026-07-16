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
      sx={{
        width: "100%",
        px: 0,
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          background: "#000000",
          color: "common.white",
          border: "1px solid #333333",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="title" sx={{ mb: 1, color: "common.white" }}>
              Đăng ký nhận tin
            </Typography>
            <Typography
              variant="regularS"
              sx={{ color: "rgba(255, 255, 255, 0.75)" }}
            >
              Nhận ngay mã giảm giá đặc biệt và cập nhật sản phẩm mới nhất.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              placeholder="Nhập email của bạn..."
              {...register("email")}
              sx={{
                minWidth: { sm: 320 },
                bgcolor: "rgba(255, 255, 255, 0.06)",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  color: "common.white",
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "12px",
                px: 4,
                py: { xs: 1.5, sm: 0 },
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Đăng ký
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Newsletter;
