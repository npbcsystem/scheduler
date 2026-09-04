import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login", { replace: true });
  };

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
      <Toolbar
        sx={{
          justifyContent: "space-between",
          py: 1.25,
          px: { xs: 2, md: 4 },
          minHeight: 76,
        }}
      >
        {/* LEFT - NPBC Branding */}
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
              sx={{
                color: "#102A43",
                lineHeight: 1.2,
                fontSize: "1.05rem",
              }}
            >
              Nairobi Pentecostal Bible College
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontWeight: 500,
              }}
            >
              Class Scheduling System
            </Typography>
          </Box>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* DATE */}
          <Chip
            icon={
              <CalendarTodayIcon
                style={{
                  fontSize: 14,
                  color: "#64748B",
                }}
              />
            }
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

          {/* USER */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                textAlign: "right",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#102A43",
                  lineHeight: 1.2,
                }}
              >
                {user?.name || "Administrator"}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: "#64748B",
                  textTransform: "capitalize",
                }}
              >
                {user?.role?.toLowerCase() || "admin"}
              </Typography>
            </Box>

            <IconButton
              onClick={handleUserMenu}
              size="large"
              aria-label="Account menu"
              aria-controls={menuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              sx={{
                color: "#1769E0",
                border: "1px solid #E2E8F0",
                bgcolor: "#F7F9FC",
                "&:hover": {
                  bgcolor: "#EEF4FF",
                },
              }}
            >
              <AccountCircleIcon fontSize="medium" />
            </IconButton>

            {/* ACCOUNT MENU */}
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: {
                    mt: 1,
                    minWidth: 240,
                    borderRadius: 2,
                    border: "1px solid #E6ECF4",
                  },
                },
              }}
            >
              {/* USER INFORMATION */}
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#102A43",
                  }}
                >
                  {user?.name || "Administrator"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    mt: 0.3,
                  }}
                >
                  {user?.email}
                </Typography>

                <Chip
                  label={user?.role || "ADMIN"}
                  size="small"
                  sx={{
                    mt: 1,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Divider />

              {/* LOGOUT */}
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.3,
                  color: "#C62828",
                  "&:hover": {
                    bgcolor: "#FFF5F5",
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon
                    fontSize="small"
                    sx={{ color: "#C62828" }}
                  />
                </ListItemIcon>

                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}