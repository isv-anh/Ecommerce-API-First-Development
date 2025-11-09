"use client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";
import AppNavigation from "@/components/navigation/AppNavigation/AppNavigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("xs"));
  const isTablet = useMediaQuery(breakpoints.between("xs", "md"));

  if (isMobile) {
    return <div>Mobile layout is not implemented yet.</div>;
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <AppNavigation open={!isTablet}>{children}</AppNavigation>
    </Box>
  );
};

export default MainLayout;
