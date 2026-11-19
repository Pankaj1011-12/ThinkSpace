import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useThinkSpace from "../hooks/useThinkSpace";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";
import NavBar from "../layouts/NavBar";
import Footer from "../layouts/Footer";

const CONDITIONS = ["New", "Like New", "Good", "Acceptable"];
const CATEGORIES = ["Computer Science", "Engineering", "Mathematics", "Science", "Literature", "General"];

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertSeverity,
    setAlertMessage,
  } = useThinkSpace();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Contact Dialog
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // Edit Listing Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBookAuthor, setEditBookAuthor] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCondition, setEditCondition] = useState("Good");
  const [editCategory, setEditCategory] = useState("General");
  const [editDescription, setEditDescription] = useState("");
  const [editContactInfo, setEditContactInfo] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
  const currentUserId = Cookies.get(import.meta.env.VITE_USER_KEY || "userId");
  const userRole = Cookies.get(import.meta.env.VITE_USER_ROLE);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${productId}`
      );
      if (response.data.status) {
        const prod = response.data.product;
        setProduct(prod);
        setEditTitle(prod.title || "");
        setEditBookAuthor(prod.bookAuthor || "");
        setEditPrice(prod.price || "");
        setEditCondition(prod.condition || "Good");
        setEditCategory(prod.category || "General");
        setEditDescription(prod.description || "");
        setEditContactInfo(prod.contactInfo || "");
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book listing?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Book listing deleted successfully");
        navigate("/books");
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to delete listing");
    }
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
    if (editImageFile) {
      formData.append("productimage", editImageFile);
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (res.data.status) {
        setEditDialogOpen(false);
        fetchProduct();
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Book listing updated successfully!");
      }
    } catch (err) {
      console.error("Error updating book:", err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to update listing");
    }
  };

  const isOwner =
    (currentUserId && product?.authorId && product.authorId.toString() === currentUserId.toString()) ||
    userRole === "admin";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Button
          component={Link}
          to="/books"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: "#1b2e35", fontWeight: "bold" }}
        >
          Back to Book Marketplace
        </Button>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#1b2e35" }} />
          </Box>
        ) : !product ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h5" color="#1b2e35" fontWeight="bold">
              Book Listing Not Found
            </Typography>
            <Button component={Link} to="/books" variant="contained" sx={{ mt: 3, backgroundColor: "#1b2e35" }}>
              Explore Other Books
            </Button>
          </Card>
        ) : (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            <CardMedia
              component="img"
              height="380"
              image={`${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${product.image}`}
              alt={product.title}
              sx={{ objectFit: "contain", backgroundColor: "#0f172a", p: 2 }}
              onError={(e) => {
                e.target.src = "/preview.png";
              }}
            />

            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              {/* Owner Actions */}
              {isOwner && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={() => setEditDialogOpen(true)}
                    sx={{ borderColor: "#1b2e35", color: "#1b2e35" }}
                  >
                    Edit Listing
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                  >
                    Delete Listing
                  </Button>
                </Box>
              )}

              {/* Title & Badges */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: "#1b2e35", mb: 0.5 }}>
                    {product.title}
                  </Typography>
                  {product.bookAuthor && (
                    <Typography variant="subtitle1" color="text.secondary">
                      by <strong>{product.bookAuthor}</strong>
                    </Typography>
                  )}
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#0f766e" }}>
                  ₹{product.price}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
                <Chip
                  label={`Condition: ${product.condition || "Good"}`}
                  sx={{ backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: "bold" }}
                />
                <Chip
                  label={`Category: ${product.category || "General"}`}
                  sx={{ backgroundColor: "#f1f5f9", color: "#334155" }}
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b2e35", mb: 1 }}>
                Book Description
              </Typography>
              <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line", mb: 4 }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Seller Information Box */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 3,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={product.authorImage ? `${import.meta.env.VITE_SERVER_ENDPOINT}/avatar/${product.authorImage}` : undefined}
                    sx={{ bgcolor: "#1b2e35", width: 56, height: 56, fontWeight: "bold", fontSize: "1.2rem" }}
                  >
                    {product.authorName ? product.authorName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Listed by Student
                    </Typography>
                    <Link
                      to={product.authorId ? `/users/${product.authorId}` : "#"}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography variant="h6" fontWeight="bold" sx={{ "&:hover": { textDecoration: "underline" } }}>
                        {product.authorName || "ThinkSpace Member"}
                      </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      Listed on {dayjs(product.createdAt).format("MMMM D, YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={() => setContactDialogOpen(true)}
                  sx={{
                    backgroundColor: "#1b2e35",
                    color: "white",
                    px: 3,
                    py: 1.2,
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#2c4955" }
                  }}
                >
                  Contact Seller
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Contact Seller Modal */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1b2e35", color: "white" }}>
          Contact Seller 📬
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {product && (
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {product.title} (₹{product.price})
              </Typography>
              <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: 1.5, border: "1px solid #e2e8f0" }}>
                <Typography variant="body2">
                  <strong>Seller Name:</strong> {product.authorName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Email:</strong> {product.authorEmail}
                </Typography>
                {product.contactInfo && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <strong>Seller Note:</strong> {product.contactInfo}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                You can reach out to the seller directly to coordinate pickup, payment, or shipping.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContactDialogOpen(false)} color="inherit">
            Close
          </Button>
          {product?.authorEmail && (
            <Button
              variant="contained"
              href={`mailto:${product.authorEmail}?subject=Interested in purchasing: ${encodeURIComponent(product.title)}`}
              sx={{ backgroundColor: "#1b2e35", "&:hover": { backgroundColor: "#2c4955" } }}
            >
              Send Email
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Listing Modal */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1b2e35", color: "white" }}>
          Edit Book Listing
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Book Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Book Author (e.g. Robert C. Martin)"
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
              label="Contact Info / Note (optional)"
              fullWidth
              placeholder="e.g. Call or WhatsApp me on weekends"
              value={editContactInfo}
              onChange={(e) => setEditContactInfo(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
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
                style={{ display: "block", marginTop: "6px" }}
                onChange={(e) => setEditImageFile(e.target.files[0])}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
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

      <Footer />
    </Box>
  );
};

export default Product;
