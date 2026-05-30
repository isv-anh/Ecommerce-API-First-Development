"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import TextField from "@/components/inputs/TextField/TextField";
import type { LoginRequest } from "@e-commerce/api-client/schemas/auth";
import { usePostLogin } from "@e-commerce/api-client/endpoints/auth/auth";
import type { LoginFormProps } from "@/components/auth/LoginForm/types";
import { useRouter } from "next/navigation";
import { postLoginBody } from "@e-commerce/api-validation/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm({
  title = "Đăng nhập",
  mode,
}: LoginFormProps) {
  const { control, handleSubmit } = useForm<LoginRequest>({
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
    resolver: zodResolver(postLoginBody),
  });

  const mutation = usePostLogin();

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      await mutation.mutateAsync({
        data: { username: data.username, password: data.password },
      });
      router.push("/");
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
            {"Đăng nhập thất bại. Vui lòng thử lại."}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            control={control}
            name="username"
            label="Email hoặc tên đăng nhập"
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

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Button
              color="primary"
              variant="text"
              onClick={() => {
                // navigate handled by parent pages via router; keep as noop here
                // parent pages will render links/buttons for register/reset
              }}
            >
              <Typography variant="regularS">Quên mật khẩu?</Typography>
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
            loading={mutation.isPending}
          >
            Đăng nhập
          </Button>

          {mode === "user" && (
            <>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2, py: 1.2 }}
                href="/api/auth/google"
              >
                Đăng nhập với Google
              </Button>

              <Box
                mt={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="regularS">Chưa có tài khoản?</Typography>
                <Button sx={{ ml: 1 }} variant="text">
                  Đăng ký
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
