"use client";
import { ReactNode } from "react";
import Header from "./components/Header/Header";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Search from "./components/Search/Search";
import Footer from "./components/Footer/Footer";
import { useScrollTrigger } from "@mui/material";
import ActionButtonList from "./components/ActionButtonList/ActionButtonList";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  return (
    <Box sx={{ px: "clamp(16px, 4vw, 96px)" }}>
      <Header />
      <Stack
        position="sticky"
        top={0}
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          zIndex: theme.zIndex.appBar,
        })}
      >
        <Search />
      </Stack>
      {children}
      <Footer />
      <ActionButtonList />
      {trigger && <ScrollToTopButton />}
    </Box>
  );
};

export default MainLayout;
