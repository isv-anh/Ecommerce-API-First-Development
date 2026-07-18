"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  content: string;
}


export const ProductReviews = () => {
  // TODO: Fetch reviews from API using productId
  const reviews: Review[] = [];

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Typography variant="header" mb={3} sx={{ fontWeight: 700, display: "block" }}>
        Đánh giá & Nhận xét từ khách hàng
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={4}>
        {/* Review List */}
        <Grid size={{ xs: 12 }}>
          <Stack spacing={3}>
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <Box key={rev.id}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "rgba(129, 140, 248, 0.2)", color: "primary.main" }}>
                      {rev.userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Stack spacing={0.5} flex={1}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="boldS">{rev.userName}</Typography>
                        <Typography variant="regularXs" color="text.secondary">
                          {rev.date}
                        </Typography>
                      </Stack>
                      <Rating value={rev.rating} readOnly size="small" />
                      <Typography variant="regularS" color="text.secondary" mt={1}>
                        {rev.content}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider sx={{ mt: 3 }} />
                </Box>
              ))
            ) : (
              <Typography variant="regularM" color="text.secondary" textAlign="center" py={4}>
                Chưa có nhận xét nào cho sản phẩm này.
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
