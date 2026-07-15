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
    <Stack
      component={"form"}
      onSubmit={handleSubmit(handleSearch)}
      height={90}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      spacing={4}
      px={2}
    >
      <Stack width={200}>LOGO</Stack>
      <TextField
        control={control}
        name="textSearch"
        sx={{
          flexGrow: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: (theme) => theme.palette.primary.main,
            },
          },
          "& .MuiInputBase-root": {
            paddingRight: 0,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <Button
                variant="contained"
                sx={{
                  borderRadius: "12px",
                  height: "40px",
                }}
                type="submit"
              >
                <SearchRoundedIcon />
              </Button>
            ),
          },
        }}
      />
      <Stack>
        <Tooltip title="Giỏ hàng">
          <IconButton color="primary" component={NextLink} href="/cart">
            <Badge badgeContent={badgeCount} color={"error"}>
              <LocalMallIcon
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

const Search = () => {
  return (
    <Suspense
      fallback={
        <Stack
          height={90}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          spacing={4}
          px={2}
        >
          <Stack width={200}>LOGO</Stack>
          <Stack flexGrow={1} />
          <Stack width={40} height={40} />
        </Stack>
      }
    >
      <SearchBar />
    </Suspense>
  );
};

export default Search;
