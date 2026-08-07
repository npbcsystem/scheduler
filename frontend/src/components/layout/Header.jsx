import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
    >
      <Toolbar>
        {/* Container for Logo + Text */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
          <Box
            component="img"
            src="/npbc-logo-2.png" // Path relative to your public/ directory
            alt="NPBC Logo"
            sx={{
              height: 48, // Adjust logo height as needed
              width: "auto",
              objectFit: "contain",
            }}
          />

          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Nairobi Pentecostal Bible College
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Class Scheduling System
            </Typography>
          </Box>
        </Box>

        <Typography color="text.secondary">
          {new Date().toLocaleDateString()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}