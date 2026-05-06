"use client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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
      <Typography variant="header" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {DEFAULT_CATEGORIES.map((c) => (
          <Button key={c.id} href={c.href} variant="outlined" sx={{ flex: 1 }}>
            {c.name}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default FeaturedCategories;
