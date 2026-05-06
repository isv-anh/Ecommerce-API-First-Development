"use client";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { AppNavigationProps } from "./types";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import AppNavigationList from "./AppNavigationList/AppNavigationList";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  marginLeft: `-${drawerWidth - 40}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

const AppNavigation = ({
  open: initVisibleDrawer = false,
  children,
}: AppNavigationProps) => {
  const [open, setOpen] = useState(initVisibleDrawer);

  useEffect(() => {
    setOpen(initVisibleDrawer);
  }, [initVisibleDrawer]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Toolbar />
      <Box display={"flex"} height={"100%"}>
        <Box
          display={open ? "none" : "block"}
          position={"absolute"}
          mt={2}
          ml={1}
          mb={2}
          zIndex={(theme) => theme.zIndex.appBar}
          bgcolor={(theme) => theme.palette.primary.main}
          height={40}
          borderRadius={2}
        >
          <IconButton
            onClick={handleDrawerOpen}
            sx={{
              color: (theme) => theme.palette.common.white,
            }}
          >
            <ViewSidebarIcon />
          </IconButton>
        </Box>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: (theme) => theme.palette.primary.main,
              borderRadius: 4,
              padding: 1,
              marginTop: "69px",
              marginLeft: "4px",
              height: `calc(100% - 72px)`,
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <Stack spacing={1} flexGrow={1} overflow={"hidden"}>
            <Stack flexDirection={"row"} pt={1.5} pl={1}>
              <IconButton
                onClick={handleDrawerClose}
                sx={{
                  color: (theme) => theme.palette.common.white,
                }}
              >
                <ViewSidebarIcon />
              </IconButton>
            </Stack>
            <Stack flexGrow={1} overflow={"auto"}>
              <AppNavigationList />
            </Stack>
          </Stack>
          <Divider
            sx={{
              backgroundColor: (theme) => theme.palette.common.white,
            }}
          />
          <Stack p={2}></Stack>
        </Drawer>
        <Main open={open}>{children}</Main>
      </Box>
    </>
  );
};

export default AppNavigation;
