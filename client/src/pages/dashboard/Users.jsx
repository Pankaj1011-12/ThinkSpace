import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Avatar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useThinkSpace from "../../hooks/useThinkSpace";

const Users = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();

  // Edit Role Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("user");

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoadingStatus(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
          params: { query: search.trim() },
        }
      );
      if (response.data.status) {
        setData(response.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "user");
    setEditModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      setLoadingStatus(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/${selectedUser._id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      if (response.data.status) {
        setData((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, role: newRole } : u))
        );
        setEditModalOpen(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message || "User role updated successfully");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to update role");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/${userToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      if (response.data.status) {
        setData((prev) => prev.filter((item) => item._id !== userToDelete._id));
        setDeleteModalOpen(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message || "User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to delete user");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Registered Accounts Management 👥
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          View, search, edit roles, and manage student and administrator accounts.
        </Typography>
      </Box>

      {/* Search Input Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search users by name or email..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            maxWidth: 480,
            bgcolor: "#ffffff",
            "& .MuiOutlinedInput-root": { borderRadius: "10px" }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          overflow: "hidden"
        }}
      >
        <Table aria-label="users table">
          <TableHead sx={{ backgroundColor: "#1e293b" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#ffffff", py: 1.8 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#ffffff" }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#ffffff" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#ffffff" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#ffffff" }}>Registered</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#ffffff", pr: 3 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ color: "#64748b" }}>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "#0f766e", fontSize: "0.85rem", fontWeight: 700 }}>
                        {item.fullName ? item.fullName.charAt(0).toUpperCase() : "U"}
                      </Avatar>
                      <Link
                        style={{ color: "#1e293b", textDecoration: "none", fontWeight: 600 }}
                        to={`/users/${item._id}`}
                      >
                        {item.fullName}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#475569" }}>{item.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.role === "admin" ? "Admin" : "Student / User"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: item.role === "admin" ? "#f3e8ff" : "#e0f2fe",
                        color: item.role === "admin" ? "#7e22ce" : "#0369a1",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#64748b", fontSize: "0.88rem" }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Tooltip title="Change User Role">
                      <IconButton size="small" onClick={() => handleOpenEdit(item)} sx={{ color: "#0f766e", mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                      <IconButton size="small" onClick={() => handleOpenDelete(item)} sx={{ color: "#ef4444" }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#94a3b8" }}>
                  No users matched your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Role Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          Edit User Role 🔑
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
            Change role for <strong>{selectedUser?.fullName}</strong> ({selectedUser?.email}):
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="role-select-label">Account Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={newRole}
              label="Account Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="user">Student / User</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditModalOpen(false)} sx={{ textTransform: "none", color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRole}
            sx={{ bgcolor: "#0f766e", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#115e59" } }}
          >
            Save Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#b91c1c" }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#475569" }}>
            Are you sure you want to permanently delete <strong>{userToDelete?.fullName}</strong>? This action will remove all their posts and tasks.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ textTransform: "none", color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
