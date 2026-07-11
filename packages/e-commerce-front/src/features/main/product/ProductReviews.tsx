"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useSnackbar } from "notistack";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  content: string;
}

interface ProductReviewsProps {
  productId: string;
}

const DEFAULT_RATING = 5;
const DATE_PAD_LENGTH = 2;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newRating, setNewRating] = useState<number | null>(DEFAULT_RATING);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      userName: "Nguyễn Văn A",
      rating: 5,
      date: "05/07/2026",
      content: "Sản phẩm chất lượng tuyệt vời, giao hàng nhanh chóng, đóng gói cẩn thận. Rất đáng tiền!",
    },
    {
      id: "r2",
      userName: "Trần Thị B",
      rating: 4,
      date: "28/06/2026",
      content: "Máy dùng mượt mà, cấu hình mạnh mẽ đúng như mô tả. Điểm trừ duy nhất là hộp hơi bị móp nhẹ khi vận chuyển.",
    },
  ]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) {
      enqueueSnackbar("Vui lòng nhập nội dung nhận xét!", { variant: "warning" });
      return;
    }

    const reviewName = newCommentName.trim() || "Khách hàng";
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(DATE_PAD_LENGTH, "0")}/${String(
      today.getMonth() + 1
    ).padStart(DATE_PAD_LENGTH, "0")}/${today.getFullYear()}`;

    const newReview: Review = {
      id: `r-${Date.now()}`,
      userName: reviewName,
      rating: newRating || DEFAULT_RATING,
      date: formattedDate,
      content: newCommentText.trim(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setNewCommentName("");
    setNewCommentText("");
    setNewRating(DEFAULT_RATING);

    enqueueSnackbar("Gửi nhận xét thành công!", { variant: "success" });
  };

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
        {/* Write Review Form */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            component="form"
            onSubmit={handleAddReview}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="boldM" mb={2} sx={{ display: "block" }}>
              Viết nhận xét của bạn
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <Typography variant="regularS" color="text.secondary" mb={1} sx={{ display: "block" }}>
                  Đánh giá điểm số:
                </Typography>
                <Rating
                  name="new-rating"
                  value={newRating}
                  onChange={(_, val) => setNewRating(val)}
                  size="large"
                />
              </Box>

              <TextField
                label="Tên của bạn (Không bắt buộc)"
                variant="outlined"
                fullWidth
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                sx={{ bgcolor: "background.paper" }}
              />

              <TextField
                label="Nội dung nhận xét"
                variant="outlined"
                multiline
                rows={4}
                required
                fullWidth
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                sx={{ bgcolor: "background.paper" }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  py: 1,
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: 2,
                  alignSelf: "flex-start",
                }}
              >
                Gửi nhận xét
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Review List */}
        <Grid size={{ xs: 12, md: 7 }}>
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
                Chưa có nhận xét nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
