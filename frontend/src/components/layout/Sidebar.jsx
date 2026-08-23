import {
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { NavLink } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Generate Schedule", path: "/generate", icon: <AutoAwesomeIcon /> },
  { text: "Schedules", path: "/schedules", icon: <EventIcon /> },
  { text: "Branches", path: "/branches", icon: <BusinessIcon /> },
  { text: "Lecturers", path: "/lecturers", icon: <SchoolIcon /> },
  { text: "Courses", path: "/courses", icon: <MenuBookIcon /> },
  { text: "Progress", path: "/progress", icon: <TimelineIcon /> },
  { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
];

export default function Sidebar() {
  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        background: "linear-gradient(180deg, #102A43 0%, #0B2239 100%)",
        color: "#A9BCD0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ px: 3, py: 2.5, minHeight: 76 }}>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#FFFFFF", letterSpacing: 0.1, fontSize: "1.1rem" }}
          >
            NPBC Scheduler
          </Typography>
          <Typography variant="caption" sx={{ color: "#8EA5BC", fontWeight: 500 }}>
            Academic Management
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 1.5 }} />

      <List sx={{ px: 1.5, flexGrow: 1, overflowY: "auto" }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: "8px",
              mb: 0.5,
              py: 1.2,
              px: 2,
              color: "#A9BCD0",
              transition: "all 0.2s ease-in-out",
              "& .MuiListItemIcon-root": {
                color: "#86A0BA",
                minWidth: 40,
                transition: "color 0.2s ease-in-out",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#FFFFFF",
                "& .MuiListItemIcon-root": {
                  color: "#74B9FF",
                },
              },
              "&.active": {
                background: "linear-gradient(90deg, #1769E0, #237FEF)",
                color: "#FFFFFF",
                fontWeight: 600,
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.18)",
                "& .MuiListItemIcon-root": {
                  color: "#FFFFFF",
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: "medium" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
