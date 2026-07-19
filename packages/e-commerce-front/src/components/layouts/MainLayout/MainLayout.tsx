"use client";
import type { ReactNode } from "react";
import Header from "./components/Header/Header";
import Box from "@mui/material/Box";
import Search from "./components/Search/Search";
import Footer from "./components/Footer/Footer";
import { useScrollTrigger } from "@mui/material";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";


const MainLayout = ({ children }: { children: ReactNode }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  return (
    <Box
      className="min-h-screen flex flex-col bg-white font-sans"
    >
      <div className="sticky top-0 z-50 w-full flex flex-col bg-white/90 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <Header />
        <Search />
      </div>
      <div className="grow flex flex-col w-full">
        <Box className="w-full max-w-7xl mx-auto px-4 md:px-8">
          {children}
        </Box>
      </div>
      <Footer />
      {trigger && <ScrollToTopButton />}
    </Box>
  );
};

export default MainLayout;
