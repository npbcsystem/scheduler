import {
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Stack,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { NavLink, useLocation } from "react-router-dom";
import { brand } from "../../theme";

const menuItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Generate Schedule", path: "/generate", icon: <AutoAwesomeIcon /> },
  { text: "Schedules", path: "/schedules", icon: <EventIcon /> },
  { text: "Centers", path: "/branches", icon: <BusinessIcon /> },
  { text: "Lecturers", path: "/lecturers", icon: <SchoolIcon /> },
  { text: "Courses", path: "/courses", icon: <MenuBookIcon /> },
  { text: "Progress", path: "/progress", icon: <TimelineIcon /> },
  { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
];

export default function Sidebar({ onNavigate }) {
  const { pathname } = useLocation();
  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        width: 230,
        flexShrink: 0,
        background: "linear-gradient(165deg, #173a58 0%, #0e2438 50%, #0b2033 100%)",
        color: "#c6d8e9",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #264660",
      }}
    >
      <Toolbar disableGutters sx={{ px: 2.25, py: 2.25, mb: 1.25, borderBottom: "1px solid #ffffff16" }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <Box component="img" src="/npbc-logo-2.png" alt="" sx={{ width: 40, height: 40, objectFit: "contain", bgcolor: "#fff", borderRadius: 2, p: 0.5 }} />
          <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#fff", lineHeight: 1.2, fontSize: "1rem" }}
          >
            NPBC Scheduler
          </Typography>
          <Typography variant="caption" sx={{ color: brand.brass }}>
            Academic scheduling
          </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <List sx={{ px: 1.5, flexGrow: 1, overflowY: "auto" }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            selected={pathname === "/" && item.path === "/schedules"}
            onClick={onNavigate}
            sx={{
              borderRadius: "8px",
              mb: 0.5,
              py: 1,
              px: 1.5,
              color: "#c6d8e9",
              border: "1px solid transparent",
              transition: "all 0.2s ease-in-out",
              "& .MuiListItemIcon-root": {
                color: "#a3bed6",
                minWidth: 35,
                transition: "color 0.2s ease-in-out",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#FFFFFF",
                "& .MuiListItemIcon-root": {
                  color: brand.brass,
                },
              },
              "&.active, &.Mui-selected": {
                background: "#ffffff15",
                borderColor: "#ffffff20",
                color: "#FFFFFF",
                fontWeight: 600,
                "& .MuiListItemIcon-root": {
                  color: brand.brass,
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              slotProps={{ primary: { sx: { fontSize: "0.9rem", fontWeight: "medium" } } }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
