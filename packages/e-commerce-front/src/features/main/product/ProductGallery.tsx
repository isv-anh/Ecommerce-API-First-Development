"use client";

import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";

const INACTIVE_OPACITY = 0.6;

interface ProductGalleryProps {
  allImages: string[];
  productName: string;
  activeImageIdx: number;
  setActiveImageIdx: (idx: number | ((prev: number) => number)) => void;
}

export const ProductGallery = ({
  allImages,
  productName,
  activeImageIdx,
  setActiveImageIdx,
}: ProductGalleryProps) => {
  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % allImages.length);
  };

  return (
    <Stack spacing={2}>
      {/* Main Image Display Carousel */}
      <Box
        sx={{
          aspectRatio: "4/3",
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "#f8fafc",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
          "&:hover .carousel-nav": {
            opacity: 1,
          },
        }}
      >
        {allImages[activeImageIdx] ? (
          <Image
            src={allImages[activeImageIdx]}
            alt={productName}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <Stack alignItems="center" justifyContent="center" height="100%">
            <Typography variant="regularS" color="text.secondary">
              Không có hình ảnh
            </Typography>
          </Stack>
        )}

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <IconButton
              className="carousel-nav"
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.9)",
                color: "text.primary",
                opacity: 0,
                transition: "opacity 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  bgcolor: "common.white",
                  color: "primary.main",
                },
                width: 40,
                height: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              className="carousel-nav"
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.9)",
                color: "text.primary",
                opacity: 0,
                transition: "opacity 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  bgcolor: "common.white",
                  color: "primary.main",
                },
                width: 40,
                height: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}

        {/* Slide Indicator dot overlays */}
        {allImages.length > 1 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "rgba(21, 20, 38, 0.4)",
              px: 1.5,
              py: 0.8,
              borderRadius: 4,
            }}
          >
            {allImages.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: activeImageIdx === idx ? "common.white" : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "common.white",
                  },
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Thumbnail Row */}
      {allImages.length > 1 && (
        <Stack direction="row" spacing={1.5} overflow="auto" py={1}>
          {allImages.map((url, idx) => (
            <Box
              key={idx}
              onClick={() => setActiveImageIdx(idx)}
              sx={{
                width: 70,
                height: 70,
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid",
                borderColor: activeImageIdx === idx ? "primary.main" : "divider",
                opacity: activeImageIdx === idx ? 1 : INACTIVE_OPACITY,
                transition: "all 0.2s ease",
                "&:hover": {
                  opacity: 1,
                  borderColor: "primary.light",
                },
              }}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${idx}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
