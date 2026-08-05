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
        <Box sx={{ flexGrow: 1 }}>
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

        <Typography
          color="text.secondary"
        >
          {new Date().toLocaleDateString()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}