import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Stack
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../layouts/NavBar";
import Footer from "../layouts/Footer";

const CATEGORIES = ["All", "Computer Science", "Engineering", "Mathematics", "Science", "Literature", "General"];
const CONDITIONS = ["All", "New", "Like New", "Good", "Acceptable"];

const getConditionColor = (cond) => {
  switch (cond) {
    case "New": return { bg: "#dcfce7", color: "#15803d" };
    case "Like New": return { bg: "#e0e7ff", color: "#4338ca" };
    case "Good": return { bg: "#fef9c3", color: "#a16207" };
    case "Acceptable": return { bg: "#fee2e2", color: "#b91c1c" };
    default: return { bg: "#f1f5f9", color: "#475569" };
  }
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Contact Seller Dialog State
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const catParam = category === "All" ? "" : category;
      const condParam = condition === "All" ? "" : condition;
      const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/products/explore?page=${page}&limit=8&search=${encodeURIComponent(search)}&category=${encodeURIComponent(catParam)}&condition=${encodeURIComponent(condParam)}&sort=${sort}`;
      
      const res = await axios.get(url);
      if (res.data.status) {
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, category, condition, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleOpenContact = (book) => {
    setSelectedSeller({
      bookTitle: book.title,
      price: book.price,
      sellerName: book.seller?.fullName || "ThinkSpace Member",
      sellerEmail: book.seller?.email || "Not provided",
      contactInfo: book.contactInfo || "No custom note provided"
    });
    setContactDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Banner */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #1b2e35 0%, #115e59 100%)",
            color: "white"
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "Platypi, sans-serif" }}>
              Student Book Marketplace 📚
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Buy, sell, or exchange textbooks, notes, and study resources with fellow students.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/add-product"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#59e3a7",
              color: "#1b2e35",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#4cd195" },
              px: 3,
              py: 1.2
            }}
          >
            List a Book
          </Button>
        </Box>

        {/* Filter Bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 4,
            backgroundColor: "white",
            p: 2.5,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              placeholder="Search by book title, author, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: "260px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b" }} />
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1b2e35",
                color: "white",
                "&:hover": { backgroundColor: "#2c4955" }
              }}
            >
              Search
            </Button>
            <FormControl size="small" sx={{ minWidth: "160px" }}>
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="newest">🕒 Newest Listed</MenuItem>
                <MenuItem value="price-low">💰 Price: Low to High</MenuItem>
                <MenuItem value="price-high">💎 Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Category & Condition Chips */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#475569", mr: 1 }}>
              Category:
            </Typography>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                color={category === cat ? "primary" : "default"}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                size="small"
                sx={{
                  fontWeight: category === cat ? "bold" : "normal"
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#475569", mr: 1 }}>
              Condition:
            </Typography>
            {CONDITIONS.map((cond) => (
              <Chip
                key={cond}
                label={cond}
                clickable
                variant={condition === cond ? "filled" : "outlined"}
                onClick={() => {
                  setCondition(cond);
                  setPage(1);
                }}
                size="small"
                sx={{
                  fontWeight: condition === cond ? "bold" : "normal"
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Book Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#1b2e35" }} />
          </Box>
        ) : books.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "white",
              borderRadius: 2,
              p: 4
            }}
          >
            <AutoStoriesIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No book listings match your criteria.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search filters or be the first to list this textbook!
            </Typography>
            <Button
              component={Link}
              to="/add-product"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#1b2e35",
                color: "white",
                "&:hover": { backgroundColor: "#2c4955" }
              }}
            >
              Post a Book
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {books.map((book) => {
              const condStyle = getConditionColor(book.condition);
              const imageUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${book.image}`;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
                      }
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl}
                        alt={book.title}
                        sx={{ objectFit: "cover", backgroundColor: "#f1f5f9" }}
                        onError={(e) => {
                          e.target.src = "/preview.png";
                        }}
                      />
                      <Chip
                        label={book.condition || "Good"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: condStyle.bg,
                          color: condStyle.color,
                          fontWeight: "bold",
                          fontSize: "0.75rem"
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flex: 1, pb: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          fontSize: "1.05rem",
                          color: "#1b2e35",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {book.title}
                      </Typography>

                      {book.bookAuthor && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          by {book.bookAuthor}
                        </Typography>
                      )}

                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ color: "#0f766e", my: 1 }}
                      >
                        ₹{book.price}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 1.5
                        }}
                      >
                        {book.description}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      {/* Seller Tag */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: "#64748b" }} />
                        <Link
                          to={book.seller?._id ? `/users/${book.seller._id}` : "#"}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#475569",
                              fontWeight: 500,
                              "&:hover": { textDecoration: "underline" }
                            }}
                          >
                            Seller: {book.seller?.fullName || "Student"}
                          </Typography>
                        </Link>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                      <Button
                        component={Link}
                        to={`/products/${book._id}`}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{
                          borderColor: "#1b2e35",
                          color: "#1b2e35",
                          textTransform: "none",
                          fontWeight: "bold",
                          "&:hover": { borderColor: "#1b2e35", backgroundColor: "#f1f5f9" }
                        }}
                      >
                        Details
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={() => handleOpenContact(book)}
                        startIcon={<EmailIcon />}
                        sx={{
                          backgroundColor: "#1b2e35",
                          color: "white",
                          textTransform: "none",
                          fontWeight: "bold",
                          "&:hover": { backgroundColor: "#2c4955" }
                        }}
                      >
                        Contact
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
            />
          </Box>
        )}
      </Container>

      {/* Contact Seller Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1b2e35", color: "white" }}>
          Contact Book Seller 📬
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSeller && (
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedSeller.bookTitle} (₹{selectedSeller.price})
              </Typography>
              <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: 1.5, border: "1px solid #e2e8f0" }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Seller:</strong> {selectedSeller.sellerName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <strong>Email:</strong> {selectedSeller.sellerEmail}
                </Typography>
                {selectedSeller.contactInfo && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <strong>Note:</strong> {selectedSeller.contactInfo}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                You can reach out to the seller directly via email or messaging to arrange payment and collection.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContactDialogOpen(false)} color="inherit">
            Close
          </Button>
          {selectedSeller?.sellerEmail && (
            <Button
              variant="contained"
              href={`mailto:${selectedSeller.sellerEmail}?subject=Inquiry about ${encodeURIComponent(selectedSeller.bookTitle)}`}
              sx={{ backgroundColor: "#1b2e35", "&:hover": { backgroundColor: "#2c4955" } }}
            >
              Open Email App
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Books;
