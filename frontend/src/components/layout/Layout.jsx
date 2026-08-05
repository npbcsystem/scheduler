import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { Box } from "@mui/material";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          ml: "250px",
        }}
      >
        <Header />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
