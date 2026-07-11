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
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          borderRadius: 2,
          p: { xs: 3, md: 4 },
          bgcolor: "#151426",
          color: "common.white",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="title" sx={{ mb: 1 }}>
              Đăng ký nhận tin
            </Typography>
            <Typography
              variant="regularS"
              sx={{ color: "rgba(255,255,255,.72)" }}
            >
              Nhận mã giảm giá và cập nhật sản phẩm mới nhất.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Email"
              {...register("email")}
              sx={{
                minWidth: { sm: 320 },
                bgcolor: "common.white",
                borderRadius: 1,
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Đăng ký
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Newsletter;
