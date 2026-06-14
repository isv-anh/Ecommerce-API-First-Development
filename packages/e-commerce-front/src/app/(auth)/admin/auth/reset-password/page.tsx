"use client";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Page() {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      sx={{ px: 2 }}
    >
      <Paper sx={{ maxWidth: 640, width: "100%", p: 4 }}>
        <Typography sx={theme.typography.title}>Quên mật khẩu Admin</Typography>
        <Typography sx={theme.typography.regularS} mt={2}>
          Trang đặt lại mật khẩu admin tạm thời.
        </Typography>
      </Paper>
    </Box>
  );
}
