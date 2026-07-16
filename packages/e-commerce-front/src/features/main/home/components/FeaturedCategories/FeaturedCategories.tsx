import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Minimalist categories
const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Thời trang", href: "/product" },
  { id: "c2", name: "Đồ điện tử", href: "/product" },
  { id: "c3", name: "Nhà cửa", href: "/product" },
  { id: "c4", name: "Đồ chơi", href: "/product" },
];

const FeaturedCategories = ({
  title = "Danh mục",
}: {
  title?: string;
}) => {
  return (
    <Box
      component="section"
      sx={{ width: "100%", px: 0, py: 4 }}
    >
      <Typography variant="header" sx={{ mb: 3, fontWeight: 700 }}>
        {title}
      </Typography>

      <Grid container spacing={2.5}>
        {DEFAULT_CATEGORIES.map((c) => (
          <Grid key={c.id} size={{ xs: 6, md: 3 }}>
            <Button
              href={c.href}
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{
                minHeight: 80,
                justifyContent: "space-between",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "#E5E7EB", // gray-200
                background: "#ffffff",
                px: 3,
                color: "#111827", // gray-900
                fontWeight: 600,
                fontSize: "1.05rem",
                "& .MuiButton-endIcon": {
                  transition: "transform 0.2s ease",
                  opacity: 0,
                  transform: "translateX(-10px)",
                },
                "&:hover": {
                  borderColor: "#000000",
                  background: "#FAFAFA", // gray-50
                  "& .MuiButton-endIcon": {
                    transform: "translateX(0)",
                    opacity: 1,
                  },
                },
                transition: "all 0.2s ease",
              }}
            >
              {c.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedCategories;
