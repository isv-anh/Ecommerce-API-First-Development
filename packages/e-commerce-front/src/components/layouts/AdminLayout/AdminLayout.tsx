"use client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import AppNavigation from "@/components/navigation/AppNavigation/AppNavigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import Fabs from "@/components/inputs/Fabs/Fabs";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("xs"));
  const isTablet = useMediaQuery(breakpoints.between("xs", "md"));

  if (isMobile) {
    return <div>Mobile layout is not implemented yet.</div>;
  }
  return (
    <Box sx={{ flexGrow: 1, height: `calc(100vh - 64px)` }}>
      <AppBar
        sx={{
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Typography variant="boldL" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <AppNavigation open={!isTablet}>
        <Stack spacing={2}>
          <Typography>Test</Typography>
          {children}
          <Fabs />
        </Stack>
      </AppNavigation>
    </Box>
  );
};

export default AdminLayout;
