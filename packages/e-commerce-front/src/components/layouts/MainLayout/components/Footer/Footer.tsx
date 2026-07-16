"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import NextLink from "next/link";

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: (t) => t.palette.background.paper, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="boldM" sx={{ mb: 1.5, fontSize: "1.2rem" }}>
              E-Commerce
            </Typography>
            <Typography variant="regularXs" sx={{ color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Nơi mua sắm đáng tin cậy — sản phẩm chất lượng, giao hàng nhanh.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" component={NextLink} href="https://facebook.com">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Instagram" component={NextLink} href="https://instagram.com">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="Twitter" component={NextLink} href="https://twitter.com">
                <TwitterIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="boldS" sx={{ mb: 1.5, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827" }}>
              Công ty
            </Typography>
            <Stack spacing={1}>
              <Link component={NextLink} href="/about" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Về chúng tôi</Typography>
              </Link>
              <Link component={NextLink} href="/careers" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Tuyển dụng</Typography>
              </Link>
              <Link component={NextLink} href="/contact" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Liên hệ</Typography>
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="boldS" sx={{ mb: 1.5, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827" }}>
              Hỗ trợ
            </Typography>
            <Stack spacing={1}>
              <Link component={NextLink} href="/help" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Trợ giúp</Typography>
              </Link>
              <Link component={NextLink} href="/shipping" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Vận chuyển</Typography>
              </Link>
              <Link component={NextLink} href="/returns" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Hoàn trả</Typography>
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="boldS" sx={{ mb: 1.5, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827" }}>
              Luật & Quy định
            </Typography>
            <Stack spacing={1}>
              <Link component={NextLink} href="/terms" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Điều khoản dịch vụ</Typography>
              </Link>
              <Link component={NextLink} href="/privacy" underline="none">
                <Typography variant="regularXs" sx={{ fontSize: "0.85rem", color: "text.secondary", "&:hover": { color: "#111827" }, transition: "color 0.2s" }}>Chính sách bảo mật</Typography>
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: 1, borderColor: "divider", mt: 4, pt: 3 }}>
          <Typography variant="regularXs" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
