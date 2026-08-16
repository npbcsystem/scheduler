import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Header() {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src="/npbc-logo-2.png"
            alt="NPBC Logo"
            sx={{
              height: 44,
              width: "auto",
              objectFit: "contain",
              p: 0.5,
              borderRadius: 1,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#0F172A", lineHeight: 1.2, fontSize: "1.1rem" }}
            >
              Nairobi Pentecostal Bible College
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
              Class Scheduling System
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<CalendarTodayIcon style={{ fontSize: 14, color: "#64748B" }} />}
          label={formattedDate}
          variant="outlined"
          sx={{
            borderColor: "#E2E8F0",
            color: "#475569",
            fontWeight: 500,
            fontSize: "0.8rem",
            bgcolor: "#F8FAFC",
          }}
        />
      </Toolbar>
    </AppBar>
  );
}