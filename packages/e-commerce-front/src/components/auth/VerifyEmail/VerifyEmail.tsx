"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { verifyEmailAction, resendVerificationAction } from "@/utils/verifyEmail";
import Link from "next/link";
import tokenStore from "@e-commerce/api-client/storages/token-storage";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = useState("");

  const handleVerify = () => {
    if (!email || !otp) {
      setStatus("error");
      setErrorMessage("Vui lòng nhập email và OTP.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    verifyEmailAction({ email, otp })
      .then((res) => {
        if (res.success && res.accessToken) {
          tokenStore.setTokens(res.accessToken);
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(res.message || "Xác thực email thất bại.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err?.message || "Lỗi hệ thống.");
      });
  };

  const handleResend = () => {
    if (!email) {
      setResendStatus("error");
      setResendMessage("Vui lòng nhập email.");
      return;
    }

    setResendStatus("loading");
    setResendMessage("");
    resendVerificationAction({ email })
      .then((res) => {
        if (res.success) {
          setResendStatus("success");
          setResendMessage(res.message || "Đã gửi lại OTP. Vui lòng kiểm tra email.");
        } else {
          setResendStatus("error");
          setResendMessage(res.message || "Gửi lại OTP thất bại.");
        }
      })
      .catch((err) => {
        setResendStatus("error");
        setResendMessage(err?.message || "Lỗi hệ thống.");
      });
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
      <Paper sx={{ maxWidth: 480, width: "100%", p: 4, textAlign: "center" }} elevation={6}>
        <Typography variant="title" gutterBottom>
          Xác thực Email
        </Typography>
        <Typography variant="regularM" color="textSecondary" sx={{ mb: 3 }}>
          Nhập mã OTP đã được gửi đến email của bạn.
        </Typography>

        {status === "success" ? (
          <Box mt={2}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Xác thực email thành công! Bạn có thể truy cập hệ thống.
            </Alert>
            <Button
              variant="contained"
              fullWidth
              component={Link}
              href="/"
              sx={{ py: 1.5, borderRadius: 3 }}
            >
              Quay lại Trang chủ
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {status === "error" && <Alert severity="error">{errorMessage}</Alert>}
            
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!emailParam}
            />
            
            <TextField
              label="Mã OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={status === "loading"}
            />
            
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerify}
              disabled={status === "loading" || !email || !otp}
              sx={{ py: 1.5, borderRadius: 3 }}
            >
              {status === "loading" ? <CircularProgress size={24} /> : "Xác thực"}
            </Button>

            <Box mt={2}>
              {resendStatus === "success" && <Alert severity="success" sx={{ mb: 2 }}>{resendMessage}</Alert>}
              {resendStatus === "error" && <Alert severity="error" sx={{ mb: 2 }}>{resendMessage}</Alert>}
              
              <Button
                variant="text"
                fullWidth
                onClick={handleResend}
                disabled={resendStatus === "loading" || !email}
              >
                {resendStatus === "loading" ? <CircularProgress size={20} /> : "Chưa nhận được mã? Gửi lại OTP"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
