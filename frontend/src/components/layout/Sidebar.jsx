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
        backgroundColor: "#0F172A",
        color: "#94A3B8",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1E293B",
      }}
    >
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#F8FAFC", letterSpacing: 0.5 }}
          >
            NPBC Scheduler
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
            Academic Management
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: "#1E293B", mb: 1 }} />

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
              color: "#94A3B8",
              transition: "all 0.2s ease-in-out",
              "& .MuiListItemIcon-root": {
                color: "#64748B",
                minWidth: 40,
                transition: "color 0.2s ease-in-out",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#F1F5F9",
                "& .MuiListItemIcon-root": {
                  color: "#38BDF8",
                },
              },
              "&.active": {
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
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