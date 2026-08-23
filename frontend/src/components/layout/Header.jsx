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
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E6ECF4",
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1.25, px: { xs: 2, md: 4 }, minHeight: 76 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src="/npbc-logo-2.png"
            alt="NPBC Logo"
            sx={{
              height: 46,
              width: "auto",
              objectFit: "contain",
              p: 0.5,
              borderRadius: 2,
              bgcolor: "#FFF",
              border: "1px solid #E6ECF4",
            }}
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#102A43", lineHeight: 1.2, fontSize: "1.05rem" }}
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
            display: { xs: "none", sm: "inline-flex" },
            borderColor: "#E2E8F0",
            color: "#53657C",
            fontWeight: 500,
            fontSize: "0.8rem",
            bgcolor: "#F7F9FC",
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
