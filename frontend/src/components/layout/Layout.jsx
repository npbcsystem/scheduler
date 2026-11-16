import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Box, Drawer } from "@mui/material";

export default function Layout() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const { pathname } = useLocation();
  const closeNavigation = () => setNavigationOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Box>
      <Drawer open={navigationOpen} onClose={closeNavigation} sx={{ display: { md: "none" } }}>
        <Sidebar onNavigate={closeNavigation} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Header onOpenNavigation={() => setNavigationOpen(true)} />

        {/* Dedicated scrollable region for content */}
        <Box
          key={pathname}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3, xl: 4 },
          }}
        >
          <Box sx={{ mx: "auto", maxWidth: 1472 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
