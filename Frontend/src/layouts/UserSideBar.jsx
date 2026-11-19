import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SellIcon from '@mui/icons-material/Sell';

import NavBar from "./NavBar";
import Footer from "./Footer";
import Cookies from "js-cookie";
import useThinkSpace from "../hooks/useThinkSpace";
import AlertBox from "../../components/common/AlertBox";

const UserSideBar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } = useThinkSpace();

  const listData = [
    {
      label: "Community Feed",
      url: "/explore",
      icon: <DynamicFeedIcon />,
    },
    {
      label: "Book Marketplace",
      url: "/books",
      icon: <MenuBookIcon />,
    },
    {
      label: "My Profile",
      url: "/profile",
      icon: <DashboardIcon />,
    },
    {
      label: "Create Post",
      url: "/add-post",
      icon: <AddBoxIcon />,
    },
    {
      label: "My Posts",
      url: "/my-post",
      icon: <ListAltIcon />,
    },
    {
      label: "List a Book",
      url: "/add-product",
      icon: <AddShoppingCartIcon />,
    },
    {
      label: "My Books",
      url: "/my-product",
      icon: <SellIcon />,
    },
    {
      label: "Task Manager",
      url: "/task-management",
      icon: <PlaylistAddCheckIcon />,
    },
    {
      label: "Settings",
      url: "/setting",
      icon: <SettingsIcon />,
    },
  ];

  const handleLogOut = () => {
    setAlertBoxOpenStatus(true);
    setAlertSeverity("success");
    setAlertMessage("Logged Out Successfully");
    Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
    Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
    Cookies.remove(import.meta.env.VITE_USER_KEY || "userId", { path: "/" });
    navigate("/login");
  };

  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
    if (!token || !role) {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
      navigate("/login");
    }
  }, []);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#ffffff", borderRight: "1px solid #e2e8f0" }}>
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.1, color: "#64748b", fontSize: "0.75rem" }}>
          Workspace Navigation
        </Typography>
        {isMobile && (
          <IconButton size="small" onClick={() => setMobileOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {listData.map(({ label, url, icon }) => {
          const isActive = location.pathname === url;
          return (
            <ListItem key={label} disablePadding sx={{ mb: 0.8 }}>
              <NavLink
                to={url}
                onClick={() => isMobile && setMobileOpen(false)}
                style={{
                  width: "100%",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "rgba(15, 118, 110, 0.08)" : "transparent",
                  color: isActive ? "#0f766e" : "#475569",
                  fontWeight: isActive ? 600 : 500,
                  borderLeft: isActive ? "3px solid #0f766e" : "3px solid transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isActive ? "#0f766e" : "#64748b" }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.92rem",
                    fontWeight: isActive ? "bold" : "medium",
                  }}
                />
              </NavLink>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
        <Box
          component="button"
          onClick={handleLogOut}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "transparent",
            color: "#e11d48",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(225, 29, 72, 0.08)"
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: "#e11d48" }}>
            <LogoutIcon />
          </ListItemIcon>
          <Typography sx={{ fontSize: "0.92rem", fontWeight: "bold" }}>
            Sign Out
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <NavBar />
      <AlertBox />

      {/* Mobile Drawer Trigger Bar */}
      {isMobile && (
        <Box sx={{ bgcolor: "#ffffff", px: 2, py: 1.2, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton onClick={() => setMobileOpen(true)} size="small" sx={{ color: "#1b2e35" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
            Menu & Navigation
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flex: 1, width: "100%" }}>
        {/* Desktop Permanent Drawer */}
        {!isMobile && (
          <Box sx={{ width: 260, flexShrink: 0, borderRight: "1px solid #e2e8f0" }}>
            {drawerContent}
          </Box>
        )}

        {/* Mobile Temporary Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: 280, boxSizing: "border-box" }
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Main Fluid Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { xs: "100%", md: "calc(100% - 260px)" },
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: "calc(100vh - 140px)",
            maxWidth: "1600px",
            mx: "auto"
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

UserSideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserSideBar;
