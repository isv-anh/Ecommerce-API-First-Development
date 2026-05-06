import { useMemo, useState } from "react";
import { MenuItemProps } from "./types";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Icon from "@mui/material/Icon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import { usePathname } from "next/navigation";
import { getPathByUrl } from "@/utils/pathMap";

const defaultPaddingLeft = 1.5;

const MenuItem = ({ appItem, pl = defaultPaddingLeft }: MenuItemProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const pathname = usePathname();

  const isActive = useMemo(() => {
    const app = getPathByUrl(pathname);
    return app?.appId === appItem.appId;
  }, [appItem.appId, pathname]);

  const hasChildrenItem = useMemo(
    () => appItem.children.length > 0,
    [appItem.children],
  );

  return (
    <>
      <ListItemButton
        sx={{
          pl: pl,
          backgroundColor: (theme) =>
            isActive ? theme.palette.common.white : theme.palette.primary.main,
          color: (theme) =>
            isActive ? theme.palette.common.black : theme.palette.common.white,
          "&:hover": isActive
            ? {
                backgroundColor: (theme) => theme.palette.common.white,
              }
            : {},
        }}
        key={appItem.appId}
        onClick={() => {
          if (hasChildrenItem) {
            handleClick();
          }
        }}
      >
        <ListItemIcon>
          <Icon>{appItem.appIcon}</Icon>
        </ListItemIcon>
        <ListItemText primary={appItem.appName} />
        {hasChildrenItem ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
      {hasChildrenItem && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {appItem.children.map((child) => (
              <MenuItem key={child.appId} appItem={child} pl={3} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default MenuItem;
