"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  image?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "s1",
    title: "Bộ sưu tập mùa hè",
    subtitle: "Ưu đãi tới 50% cho các sản phẩm chọn lọc",
    href: "/collections/summer",
    image:
      "https://i.pinimg.com/736x/c6/5b/e9/c65be95c075b8320206dede275efb86e.jpg",
  },
  {
    id: "s2",
    title: "Đồ điện tử nổi bật",
    subtitle: "Thiết bị mới nhất — giá tốt",
    href: "/collections/electronics",
    image:
      "https://i.pinimg.com/1200x/82/cf/db/82cfdb751feb1f38f60722d82fb52576.jpg",
  },
  {
    id: "s3",
    title: "Trang trí nhà cửa",
    subtitle: "Mang hơi ấm về tổ ấm của bạn",
    image:
      "https://i.pinimg.com/1200x/13/d6/24/13d624efee9651fbc56841050f8c9620.jpg",
  },
];

const ACTIVE_DOT_WIDTH = 26;
const DOT_SIZE = 10;

const SpotlightCarousel = ({
  slides = DEFAULT_SLIDES,
  timeout,
}: {
  slides?: Slide[];
  timeout?: number;
}) => {
  const [index, setIndex] = useState(0);
  const active = slides[index];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length],
  );

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (!timeout) return;
    const id = setInterval(next, timeout);
    return () => clearInterval(id);
  }, [next, timeout]);

  return (
    <Box
      component="section"
      sx={{ width: "100%", px: { xs: 2, md: 6 }, pt: { xs: 2, md: 4 } }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            minHeight: { xs: 300, md: 430 },
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            alignItems: "stretch",
            backgroundColor: "surface.card",
            backgroundImage: active.image ? `url(${active.image})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Stack
            spacing={2}
            alignItems="flex-start"
            justifyContent="center"
            sx={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, rgba(21,20,38,.72) 0%, rgba(21,20,38,.38) 48%, rgba(21,20,38,.12) 100%)",
              borderRadius: 2,
              p: { xs: 3, md: 6 },
            }}
          >
            <Typography
              variant="title"
              color="textWhite"
              sx={{ maxWidth: 520, fontSize: { xs: 28, md: 42 } }}
            >
              {active.title}
            </Typography>
            <Typography
              variant="regularM"
              color="textWhite"
              sx={{ maxWidth: 460, color: "rgba(255,255,255,.82)" }}
            >
              {active.subtitle}
            </Typography>
            {active.href && (
              <Button href={active.href} variant="contained" color="primary">
                Xem ngay
              </Button>
            )}
          </Stack>
        </Box>

        <IconButton
          aria-label="Previous"
          onClick={prev}
          sx={{
            color: "common.white",
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <IconButton
          aria-label="Next"
          onClick={next}
          sx={{
            color: "common.white",
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        {slides.map((s, i) => (
          <Box
            key={s.id}
            onClick={() => setIndex(i)}
            sx={(theme) => ({
              width: i === index ? ACTIVE_DOT_WIDTH : DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: 99,
              bgcolor:
                i === index
                  ? theme.palette.primary.main
                  : theme.palette.action.disabledBackground,
              cursor: "pointer",
              transition: "width 0.18s ease",
            })}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SpotlightCarousel;
