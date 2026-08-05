import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
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

const drawerWidth = 250;

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    text: "Generate Schedule",
    path: "/generate",
    icon: <AutoAwesomeIcon />,
  },
  {
    text: "Schedules",
    path: "/schedules",
    icon: <EventIcon />,
  },
  {
    text: "Branches",
    path: "/branches",
    icon: <BusinessIcon />,
  },
  {
    text: "Lecturers",
    path: "/lecturers",
    icon: <SchoolIcon />,
  },
  {
    text: "Courses",
    path: "/courses",
    icon: <MenuBookIcon />,
  },
  {
    text: "Progress",
    path: "/progress",
    icon: <TimelineIcon />,
  },
  {
    text: "Reports",
    path: "/reports",
    icon: <AssessmentIcon />,
  },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#0F172A",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            NPBC Scheduler
          </Typography>

          <Typography
            variant="body2"
            color="gray"
          >
            Academic Management
          </Typography>
        </Box>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              color: "white",
              "&.active": {
                backgroundColor: "#2563EB",
              },
              "&:hover": {
                backgroundColor: "#1E293B",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: "white" }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}