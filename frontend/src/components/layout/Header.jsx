import { Avatar, Box, Chip, Divider, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header({ onOpenNavigation }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const name = user?.name || "Administrator";
  const role = user?.role?.toLowerCase() || "admin";
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const date = new Intl.DateTimeFormat("en-KE", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  }).format(new Date());

  return (
    <Stack
      component="header"
      direction="row"
      spacing={1}
      sx={{
        minHeight: 68, px: { xs: 1.5, sm: 3, xl: 4 }, flexShrink: 0, alignItems: "center", justifyContent: "space-between",
        bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, alignItems: "center" }}>
        <IconButton
          onClick={onOpenNavigation}
          aria-label="Open navigation"
          sx={{ display: { md: "none" }, color: "primary.main" }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={750} noWrap sx={{ display: { xs: "none", sm: "block" } }}>
            Nairobi Pentecostal Bible College
          </Typography>
          <Typography fontWeight={750} noWrap sx={{ display: { sm: "none" } }}>NPBC Scheduler</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }} sx={{ alignItems: "center" }}>
        <Chip
          icon={<CalendarTodayIcon />}
          label={date}
          variant="outlined"
          sx={{ display: { xs: "none", lg: "inline-flex" }, bgcolor: "background.default", borderColor: "divider" }}
        />
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
          <Typography variant="body2" fontWeight={700}>{name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>{role}</Typography>
        </Box>
        <IconButton
          size="small"
          aria-label="Account menu"
          aria-controls={anchor ? "account-menu" : undefined}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.light", color: "primary.main", fontSize: 13, fontWeight: 750 }}>
            {initials}
          </Avatar>
          <ExpandMoreIcon fontSize="small" sx={{ display: { xs: "none", sm: "block" }, ml: 0.25 }} />
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 215, maxWidth: "calc(100vw - 32px)", border: "1px solid", borderColor: "divider" } } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography fontWeight={700}>{name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => {
            setAnchor(null);
            logout();
            navigate("/login", { replace: true });
          }} sx={{ color: "error.main", gap: 1.25 }}>
            <LogoutIcon fontSize="small" /> Log out
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}
