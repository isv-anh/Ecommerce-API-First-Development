"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import TextField from "@/components/inputs/TextField/TextField";
import type { RegisterFormProps } from "@/components/auth/RegisterForm/types";
import { useRouter } from "next/navigation";
import { postRegisterBody } from "@e-commerce/api-validation/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostRegister } from "@e-commerce/api-client/endpoints/auth";
import type { PostRegisterBody } from "@e-commerce/api-validation/types/auth";
import Link from "next/link";

export default function RegisterForm({ title = "Đăng ký" }: RegisterFormProps) {
  const { control, handleSubmit } = useForm<PostRegisterBody>({
    defaultValues: { username: "", email: "", password: "", name: "" },
    mode: "onSubmit",
    resolver: zodResolver(postRegisterBody),
  });

  const mutation = usePostRegister();

  const router = useRouter();

  const onSubmit: SubmitHandler<PostRegisterBody> = async (data) => {
    try {
      await mutation.mutateAsync({ data });
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch {
      // Error state handled by mutation.isError
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      minHeight="100vh"
      sx={{ px: 2 }}
    >
      <Paper sx={{ maxWidth: 480, width: "100%", p: 4 }} elevation={6}>
        <Typography variant="title" gutterBottom>
          {title}
        </Typography>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {"Đăng ký thất bại. Vui lòng thử lại hoặc kiểm tra thông tin."}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            control={control}
            name="name"
            label="Họ và tên"
            fullWidth
            margin="normal"
            size="medium"
          />

          <TextField
            control={control}
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            size="medium"
          />

          <TextField
            control={control}
            name="username"
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            size="medium"
          />

          <TextField
            control={control}
            name="password"
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            size="medium"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
            loading={mutation.isPending}
          >
            Đăng ký
          </Button>

          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="regularS">Đã có tài khoản?</Typography>
            <Button sx={{ ml: 1 }} variant="text" component={Link} href="/auth/login">
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
