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
  gradient: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "s1",
    title: "Minimalist Essentials",
    subtitle: "Khám phá bộ sưu tập phong cách tối giản với sự tĩnh lặng tinh tế",
    href: "/product",
    gradient: "linear-gradient(135deg, #000000 0%, #171717 100%)", // Solid Black
  },
  {
    id: "s2",
    title: "Thiết Kế Đột Phá",
    subtitle: "Sự kết hợp hoàn hảo giữa công nghệ và triết lý thiết kế phẳng",
    href: "/product",
    gradient: "linear-gradient(135deg, #27272A 0%, #3F3F46 100%)", // Zinc
  },
  {
    id: "s3",
    title: "Không Gian Sạch",
    subtitle: "Trải nghiệm ranh giới mới của nghệ thuật sắp đặt không gian",
    href: "/product",
    gradient: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)", // Light Gray
  },
];

const ACTIVE_DOT_WIDTH = 26;
const DOT_SIZE = 10;
const SLIDE_INTERVAL = 4000;

const SpotlightCarousel = ({
  slides = DEFAULT_SLIDES,
  timeout = SLIDE_INTERVAL,
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
      sx={{ width: "100%", px: 0, pt: 0 }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            minHeight: { xs: 300, md: 400 },
            borderRadius: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "stretch",
            background: active.gradient,
            transition: "background 0.5s ease-in-out",
            position: "relative",
          }}
        >
          {/* Glowing Ambient Spheres */}
          <Box
            sx={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              filter: "blur(60px)",
              top: -80,
              right: -80,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              filter: "blur(50px)",
              bottom: -40,
              right: 120,
              pointerEvents: "none",
            }}
          />

          <Stack
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "100%",
              height: "100%",
              zIndex: 2,
              p: { xs: 4, md: 6 },
              textAlign: "center",
            }}
          >
            <Typography
              variant="title"
              sx={{
                maxWidth: 800,
                color: active.id === "s3" ? "#000" : "common.white",
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              {active.title}
            </Typography>
            <Typography
              variant="regularL"
              sx={{
                maxWidth: 500,
                color: active.id === "s3" ? "#4B5563" : "rgba(255,255,255,0.7)",
                fontSize: { xs: "1rem", md: "1.2rem" },
                fontWeight: 500,
              }}
            >
              {active.subtitle}
            </Typography>
            {active.href && (
              <Button
                href={active.href}
                variant="contained"
                sx={{
                  bgcolor: active.id === "s3" ? "#000" : "common.white",
                  color: active.id === "s3" ? "#fff" : "#000",
                  borderRadius: "99px",
                  px: 5,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: active.id === "s3" ? "#333" : "rgba(255,255,255,0.8)",
                    transform: "scale(1.02)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Mua ngay
              </Button>
            )}
          </Stack>
        </Box>

        <IconButton
          aria-label="Previous"
          onClick={prev}
          sx={{
            color: "rgba(255,255,255,0.8)",
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.3)" },
            zIndex: 3,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <IconButton
          aria-label="Next"
          onClick={next}
          sx={{
            color: "rgba(255,255,255,0.8)",
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.3)" },
            zIndex: 3,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
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
              transition: "all 0.2s ease",
            })}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SpotlightCarousel;
