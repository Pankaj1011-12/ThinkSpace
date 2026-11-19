import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AlertBox from '../../components/common/AlertBox';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NavBar() {
  const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
  const userRole = Cookies.get(import.meta.env.VITE_USER_ROLE);
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const fetchUnreadNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.status) {
        setUnreadCount(res.data.count || 0);
      }
    } catch (e) {
      // Ignore network errors on background poll
    }
  };

  const fetchNotificationsList = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.status) {
        setNotifications(res.data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [token]);

  const handleOpenNotifications = (e) => {
    setNotificationAnchor(e.currentTarget);
    fetchNotificationsList();
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogOut = () => {
    Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
    Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
    Cookies.remove(import.meta.env.VITE_USER_KEY || "userId", { path: "/" });
    navigate("/login");
  };

  const isNotificationOpen = Boolean(notificationAnchor);

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}
        elevation={0}
      >
        <Toolbar sx={{ maxWidth: "1280px", width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <img src="/images/favicon.ico" width="40" height="40" alt="ThinkSpace" />
                <Typography
                  sx={{
                    fontFamily: "Platypi, sans-serif",
                    color: "#1b2e35",
                    fontWeight: "bold",
                    fontSize: "1.7rem"
                  }}
                  variant="h5"
                >
                  ThinkSpace
                </Typography>
              </Box>
            </Link>

            {/* Navigation Links */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                component={Link}
                to="/explore"
                startIcon={<DynamicFeedIcon />}
                sx={{
                  color: location.pathname === "/explore" ? "#0f766e" : "#475569",
                  fontWeight: location.pathname === "/explore" ? "bold" : 500,
                  textTransform: "none",
                  fontSize: "0.95rem"
                }}
              >
                Feed
              </Button>

              <Button
                component={Link}
                to="/books"
                startIcon={<MenuBookIcon />}
                sx={{
                  color: location.pathname === "/books" ? "#0f766e" : "#475569",
                  fontWeight: location.pathname === "/books" ? "bold" : 500,
                  textTransform: "none",
                  fontSize: "0.95rem"
                }}
              >
                Books
              </Button>

              {token ? (
                <>
                  {/* Notifications Bell */}
                  <Tooltip title="Notifications">
                    <IconButton
                      onClick={handleOpenNotifications}
                      sx={{ color: "#1b2e35", mx: 0.5 }}
                    >
                      <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Dashboard / Profile */}
                  <Button
                    component={Link}
                    to={userRole === "admin" ? "/dashboard" : "/profile"}
                    startIcon={<AccountCircleIcon />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#1b2e35",
                      color: "#1b2e35",
                      textTransform: "none",
                      fontWeight: "bold",
                      borderRadius: 2
                    }}
                  >
                    {userRole === "admin" ? "Admin Panel" : "My Dashboard"}
                  </Button>

                  {/* Logout Button */}
                  <Tooltip title="Sign Out">
                    <IconButton onClick={handleLogOut} sx={{ color: "#e11d48", ml: 0.5 }}>
                      <LogoutIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <ButtonGroup variant="contained" size="small" sx={{ ml: 1 }}>
                  <Button
                    component={Link}
                    to="/registration"
                    sx={{
                      backgroundColor: "#59e3a7",
                      color: "#1b2e35",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#4cd195" }
                    }}
                  >
                    Join
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      backgroundColor: "#1b2e35",
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#2c4955" }
                    }}
                  >
                    Login
                  </Button>
                </ButtonGroup>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Popover */}
      <Popover
        open={isNotificationOpen}
        anchorEl={notificationAnchor}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 340, maxHeight: 420, borderRadius: 2, p: 1 }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              startIcon={<CheckCircleOutlineIcon fontSize="small" />}
              sx={{ fontSize: "0.75rem", textTransform: "none" }}
            >
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              No notifications yet.
            </Typography>
          ) : (
            notifications.map((n) => (
              <ListItem
                key={n._id}
                component={Link}
                to={n.link || "#"}
                onClick={handleCloseNotifications}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  backgroundColor: n.read ? "transparent" : "#f0fdf4",
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": { backgroundColor: "#f8fafc" }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={n.sender?.image ? `${import.meta.env.VITE_SERVER_ENDPOINT}/avatar/${n.sender.image}` : undefined}
                    sx={{ bgcolor: "#1b2e35", color: "#59e3a7", width: 34, height: 34, fontSize: "0.85rem" }}
                  >
                    {n.sender?.fullName ? n.sender.fullName.charAt(0) : "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={n.read ? "normal" : "bold"}>
                      {n.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(n.createdAt).fromNow()}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>

      <AlertBox />
    </Box>
  );
}