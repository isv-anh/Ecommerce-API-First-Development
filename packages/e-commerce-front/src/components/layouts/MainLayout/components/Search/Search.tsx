"use client";

import React, { useState, useEffect, Suspense } from "react";
import TextField from "@/components/inputs/TextField/TextField";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import { useRouter, useSearchParams } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import NextLink from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { getCart, getCartItems } from "@e-commerce/api-client/endpoints/cart";
import { useAuth } from "@/hooks/useAuth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [badgeCount, setBadgeCount] = useState(0);
  const { userId } = useAuth();

  const textSearchParam = searchParams.get("productName") || "";

  useEffect(() => {
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBadgeCount(0);
      return;
    }

    let active = true;

    const updateBadge = async () => {
      try {
        const cart = await getCart({ userId });
        const res = await getCartItems(cart.cartId);
        const count = res.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        if (active) setBadgeCount(count);
      } catch {
        if (active) setBadgeCount(0);
      }
    };

    updateBadge();

    // Subscribe to query cache changes to update real-time
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      updateBadge();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId, queryClient]);

  const { control, handleSubmit, reset } = useForm<{ textSearch: string }>({
    defaultValues: {
      textSearch: textSearchParam,
    },
  });

  useEffect(() => {
    reset({
      textSearch: textSearchParam,
    });
  }, [textSearchParam, reset]);

  const handleSearch = (data: { textSearch: string }) => {
    const query = data.textSearch.trim();
    if (query !== "") {
      router.push(`/product?productName=${encodeURIComponent(query)}`);
    } else {
      router.push(`/product`);
    }
  };

  return (
    <Box
      className="w-full bg-white border-b border-gray-100 transition-all duration-300"
    >
      <Stack
        component={"form"}
        onSubmit={handleSubmit(handleSearch)}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        spacing={4}
        className="max-w-7xl mx-auto px-4 md:px-8 h-20"
      >
        <Stack
          width={240}
          component={NextLink}
          href="/"
          sx={{
            textDecoration: "none",
            color: "text.primary",
          }}
        >
          <Typography
            variant="title"
            sx={{
              color: "#000",
              letterSpacing: "-0.5px",
              fontSize: "1.6rem",
            }}
          >
            E-Commerce
          </Typography>
        </Stack>
        <TextField
          control={control}
          name="textSearch"
          className="grow max-w-2xl"
          placeholder="Tìm kiếm sản phẩm..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              transition: "all 0.2s ease",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d1d5db",
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                   borderColor: "#000000",
                   borderWidth: "1px",
                }
              },
            },
            "& .MuiInputBase-root": {
              paddingRight: "6px",
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "6px",
                    height: "36px",
                    minWidth: "48px",
                    px: 2,
                  }}
                  type="submit"
                >
                  <SearchRoundedIcon fontSize="small" />
                </Button>
              ),
            },
          }}
        />
        <Stack>
          <Tooltip title="Giỏ hàng">
            <IconButton
              component={NextLink}
              href="/cart"
              className="bg-gray-50 hover:bg-gray-100 transition-colors"
              sx={{ width: 48, height: 48, color: "#111827" }}
            >
              <Badge badgeContent={badgeCount} color={"error"}>
                <LocalMallIcon sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
};

const Search = () => {
  return (
    <Suspense
      fallback={
        <Box
          className="w-full bg-white border-b border-gray-200"
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={4}
            className="max-w-7xl mx-auto px-4 md:px-8 h-20"
          >
            <Stack width={240}>LOGO</Stack>
            <Stack flexGrow={1} />
            <Stack width={48} height={48} />
          </Stack>
        </Box>
      }
    >
      <SearchBar />
    </Suspense>
  );
};

export default Search;
