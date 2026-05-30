"use client";

import { useMemo, useState } from "react";
import type { MenuItemProps } from "./types";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Icon from "@mui/material/Icon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import { usePathname } from "next/navigation";
import Link from "next/link";

const defaultPaddingLeft = 1.5;

const MenuItem = ({ menuItem, pl = defaultPaddingLeft }: MenuItemProps) => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const hasChildrenItem = useMemo(
    () => !!menuItem.children?.length,
    [menuItem.children],
  );

  const isActive = useMemo(() => {
    return pathname === menuItem.path;
  }, [pathname, menuItem.path]);

  const handleClick = () => {
    if (hasChildrenItem) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      <ListItemButton
        component={menuItem.isNavigate ? Link : "button"}
        href={menuItem.isNavigate ? menuItem.path : undefined}
        onClick={handleClick}
        sx={{
          pl,
          width: "calc(100% - 16px)",
          mx: 1,
          borderRadius: 2,

          backgroundColor: isActive ? "rgba(255,255,255,0.18)" : "transparent",

          color: (theme) => theme.palette.common.white,

          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
          },

          "& .MuiListItemIcon-root": {
            color: "inherit",
            minWidth: 36,
          },
        }}
      >
        {menuItem.icon && (
          <ListItemIcon>
            <Icon>{menuItem.icon}</Icon>
          </ListItemIcon>
        )}

        <ListItemText primary={menuItem.name} />

        {hasChildrenItem && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      {hasChildrenItem && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuItem.children?.map((child) => (
              <MenuItem
                key={child.path}
                menuItem={child}
                pl={pl + defaultPaddingLeft}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default MenuItem;
