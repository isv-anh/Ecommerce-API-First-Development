"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Lightweight placeholder categories until categories API is available
const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Thời trang", href: "/fashion" },
  { id: "c2", name: "Đồ điện tử", href: "/electronics" },
  { id: "c3", name: "Nhà cửa", href: "/home" },
  { id: "c4", name: "Đồ chơi", href: "/toys" },
];

const FeaturedCategories = ({
  title = "Danh mục nổi bật",
}: {
  title?: string;
}) => {
  return (
    <Box
      component="section"
      sx={{ width: "100%", px: { xs: 2, md: 6 }, py: 4 }}
    >
      <Typography variant="title" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {DEFAULT_CATEGORIES.map((c) => (
          <Grid key={c.id} size={{ xs: 6, md: 3 }}>
            <Button
              href={c.href}
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 72,
                justifyContent: "space-between",
                borderRadius: 2,
                bgcolor: "background.paper",
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
