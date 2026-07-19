"use client";

import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";


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
      {/* Main Image Display Carousel */}
      <Box
        className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-50 border border-gray-200 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)]"
      >
        {allImages[activeImageIdx] ? (
          <Image
            src={allImages[activeImageIdx]}
            alt={productName}
            fill
            className="transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
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
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 scale-90 bg-white/60 backdrop-blur-md text-gray-800 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 hover:bg-white/95! hover:text-indigo-600! shadow-md w-11 h-11"
            >
              <ArrowBackIosNewIcon fontSize="small" className="ml-1" />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 scale-90 bg-white/60 backdrop-blur-md text-gray-800 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 hover:bg-white/95! hover:text-indigo-600! shadow-md w-11 h-11"
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
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-white ${
                  activeImageIdx === idx ? "bg-white" : "bg-white/50"
                }`}
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
              className={`w-[72px] h-[72px] relative rounded-[10px] overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-100 hover:border-indigo-400 hover:-translate-y-0.5 ${
                activeImageIdx === idx
                  ? "border-2 border-indigo-600 opacity-100 shadow-[0_4px_12px_rgba(79,70,229,0.2)] -translate-y-0.5"
                  : "border border-gray-200 opacity-60 translate-y-0"
              }`}
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
