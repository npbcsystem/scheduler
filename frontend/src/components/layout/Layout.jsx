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
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - 250px)`, // Occupies exact remaining screen width
          minWidth: 0,                 // Prevents wide tables from stretching layout
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <Box sx={{ p: 3, flexGrow: 1, overflowX: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}