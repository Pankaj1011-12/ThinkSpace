import { useEffect, useState } from "react";
import useThinkSpace from "../hooks/useThinkSpace";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const MyPost = () => {
  const [data, setData] = useState([]);
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState("public");

  const fetchData = async () => {
    setLoadingStatus(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData((prevData) => prevData.filter((post) => post._id !== postId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to delete post");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleVisibility = async (postId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/change-visibility/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setData((prevData) =>
          prevData.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  visibility:
                    post.visibility === "public" ? "private" : "public",
                }
              : post
          )
        );
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to update visibility");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingPostId(item._id);
    setEditTitle(item.title);
    setEditTags(item.tags ? item.tags.join(", ") : "");
    setEditDescription(item.description);
    setEditVisibility(item.visibility || "public");
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title and description are required.");
      return;
    }

    try {
      setLoadingStatus(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${editingPostId}`,
        {
          title: editTitle.trim(),
          tags: editTags,
          description: editDescription.trim(),
          visibility: editVisibility,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (res.data.status) {
        setEditOpen(false);
        fetchData();
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Post updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ color: "#1b2e35", mb: 2 }}>
        My Published Thoughts & Posts 📝
      </Typography>
      <TableContainer component={Paper} sx={{ width: "100%", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <Table aria-label="my posts table">
          <TableHead sx={{ backgroundColor: "#1b2e35" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Likes</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Comments</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Visibility</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                  You have not published any posts yet. Click "Create Post" to get started!
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    <Link style={{ color: "#1b2e35", textDecoration: "none" }} to={`/posts/${item._id}`}>
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.reactions ? item.reactions.length : 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.comments ? item.comments.length : 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Tooltip title={`Click to toggle (Currently ${item.visibility})`}>
                      <Box
                        onClick={() => handleVisibility(item._id)}
                        sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 0.5 }}
                      >
                        {item.visibility === "private" ? (
                          <VisibilityOffIcon color="action" />
                        ) : (
                          <VisibilityIcon color="primary" />
                        )}
                        <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                          {item.visibility}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Tooltip title="Edit Post">
                        <EditIcon
                          sx={{
                            border: "1px solid #cbd5e1",
                            borderRadius: "5px",
                            p: "4px",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f1f5f9" }
                          }}
                          onClick={() => handleOpenEdit(item)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete Post">
                        <DeleteIcon
                          sx={{
                            border: "1px solid #fecdd3",
                            borderRadius: "5px",
                            p: "4px",
                            color: "#e11d48",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#ffe4e6" }
                          }}
                          onClick={() => handleDelete(item._id)}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1b2e35", color: "white" }}>Edit Post</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Tags (comma-separated)"
              fullWidth
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Visibility</InputLabel>
              <Select
                value={editVisibility}
                label="Visibility"
                onChange={(e) => setEditVisibility(e.target.value)}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description (Markdown)"
              fullWidth
              multiline
              rows={5}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            sx={{ backgroundColor: "#1b2e35", "&:hover": { backgroundColor: "#2c4955" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPost;
