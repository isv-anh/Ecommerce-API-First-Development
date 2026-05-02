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
import Breadcrumbs from "@/components/navigation/Breadcrumbs/Breadcrumbs";
import CategoryTree from "@/features/main/category/components/CategoryTree/CategoryTree";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  return (
    <Box
      sx={{
        px: "clamp(16px, 4vw, 96px)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Stack
        position="sticky"
        top={0}
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          zIndex: theme.zIndex.appBar + 1,
        })}
      >
        <Search />
      </Stack>
      <Stack flexGrow={1} flexDirection={"row"}>
        <Box
          sx={{
            position: "sticky",
            top: 90,
            alignSelf: "flex-start",
          }}
        >
          <CategoryTree />
        </Box>
        <Box>
          <Box
            sx={{
              position: "sticky",
              top: 90,
              alignSelf: "flex-start",
              flexGrow: 1,
              backgroundColor: "common.white",
              zIndex: "appBar",
              width: "100%",
              pb: 2,
              pl: 6,
            }}
          >
            <Breadcrumbs />
          </Box>
          {children}
        </Box>
      </Stack>
      <Footer />
      <ActionButtonList />
      {trigger && <ScrollToTopButton />}
    </Box>
  );
};

export default MainLayout;
