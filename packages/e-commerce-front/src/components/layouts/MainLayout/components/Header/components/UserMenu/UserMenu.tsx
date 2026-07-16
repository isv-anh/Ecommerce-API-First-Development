"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import tokenStore from "@e-commerce/api-client/storages/token-storage";
import { logout } from "@/utils/login";
import type { UserProfile } from "@e-commerce/api-client/schemas/auth";

interface UserMenuProps {
  user: UserProfile;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      tokenStore.clear();
      queryClient.clear();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get initial character for Avatar
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <Button
        id="user-menu-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="text"
        size="small"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: "0.8rem",
              bgcolor: "primary.main",
              color: "common.white",
            }}
          >
            {initial}
          </Avatar>
        }
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: "text.primary",
        }}
      >
        {user.name}
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-menu-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 180,
              mt: 1,
              borderRadius: 2,
              "& .MuiMenuItem-root": {
                typography: "regularS",
                py: 1,
                px: 2,
              },
            },
          },
        }}
      >
        <MenuItem
          component={NextLink}
          href="/me"
          onClick={handleClose}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Tài khoản của tôi
        </MenuItem>
        <MenuItem
          component={NextLink}
          href="/me/order"
          onClick={handleClose}
        >
          <ListItemIcon>
            <ListAltIcon fontSize="small" />
          </ListItemIcon>
          Đơn mua của tôi
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
}
