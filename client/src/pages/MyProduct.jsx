import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip
} from "@mui/material";
import { useEffect, useState } from "react";
import useThinkSpace from "../hooks/useThinkSpace";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

const CONDITIONS = ["New", "Like New", "Good", "Acceptable"];
const CATEGORIES = ["Computer Science", "Engineering", "Mathematics", "Science", "Literature", "General"];

const MyProduct = () => {
  const [data, setData] = useState([]);
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBookAuthor, setEditBookAuthor] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCondition, setEditCondition] = useState("Good");
  const [editCategory, setEditCategory] = useState("General");
  const [editDescription, setEditDescription] = useState("");
  const [editContactInfo, setEditContactInfo] = useState("");
  const [editFile, setEditFile] = useState(null);

  const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);

  const fetchData = async () => {
    setLoadingStatus(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setData(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleRemove = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this book listing?")) return;
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setData((prev) => prev.filter((item) => item._id !== productId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleOpenEdit = (product) => {
    setEditingId(product._id);
    setEditTitle(product.title || "");
    setEditBookAuthor(product.bookAuthor || "");
    setEditPrice(product.price || "");
    setEditCondition(product.condition || "Good");
    setEditCategory(product.category || "General");
    setEditDescription(product.description || "");
    setEditContactInfo(product.contactInfo || "");
    setEditFile(null);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle || !editPrice || !editDescription) {
      alert("Title, price, and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("bookAuthor", editBookAuthor);
    formData.append("price", editPrice);
    formData.append("condition", editCondition);
    formData.append("category", editCategory);
    formData.append("description", editDescription);
    formData.append("contactInfo", editContactInfo);
    if (editFile) {
      formData.append("productimage", editFile);
    }

    try {
      setLoadingStatus(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (res.data.status) {
        setEditOpen(false);
        fetchData();
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Listing updated successfully!");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to update listing");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ color: "#1b2e35", mb: 3 }}>
        My Listed Books & Products 📚
      </Typography>

      {data.length === 0 ? (
        <Box textAlign="center" mt={5} sx={{ p: 4, backgroundColor: "white", borderRadius: 2 }}>
          <Typography variant="h5" color="#1b2e35" fontWeight="bold">
            No Books Listed Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Have textbooks, notes, or study materials you'd like to sell to other students?
          </Typography>
          <Button
            component={Link}
            to="/add-product"
            variant="contained"
            sx={{ backgroundColor: "#1b2e35", "&:hover": { backgroundColor: "#2c4955" } }}
          >
            List a Book Now
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} paddingBottom={5}>
          {data.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${product.image}`}
                    alt={product.title}
                    sx={{ objectFit: "cover", backgroundColor: "#f1f5f9" }}
                    onError={(e) => {
                      e.target.src = "/preview.png";
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      display: "flex",
                      gap: 1
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        color: "#0f766e",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                        "&:hover": { backgroundColor: "#f8fafc" },
                      }}
                      onClick={() => handleOpenEdit(product)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        color: "#e11d48",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                        "&:hover": { backgroundColor: "#f8fafc" },
                      }}
                      onClick={() => handleRemove(product._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ pb: 2 }}>
                  <Link
                    to={`/products/${product._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#1b2e35", "&:hover": { textDecoration: "underline" } }}
                      noWrap
                    >
                      {product.title}
                    </Typography>
                  </Link>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f766e" }}>
                      ₹{product.price}
                    </Typography>
                    <Chip label={product.condition || "Good"} size="small" sx={{ fontSize: "0.75rem" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Book Listing Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1b2e35", color: "white" }}>Edit Book Listing</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Book Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Book Author (Optional)"
              fullWidth
              value={editBookAuthor}
              onChange={(e) => setEditBookAuthor(e.target.value)}
            />
            <TextField
              label="Price (in ₹)"
              type="number"
              fullWidth
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                value={editCondition}
                label="Condition"
                onChange={(e) => setEditCondition(e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editCategory}
                label="Category"
                onChange={(e) => setEditCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Contact Info / Note"
              fullWidth
              value={editContactInfo}
              onChange={(e) => setEditContactInfo(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Replace Cover Photo (optional):
              </Typography>
              <input
                type="file"
                accept="image/*"
                style={{ display: "block", marginTop: "4px" }}
                onChange={(e) => setEditFile(e.target.files[0])}
              />
            </Box>
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
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProduct;
