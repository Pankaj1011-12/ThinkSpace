import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Button,
  Stack,
  Divider
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArticleIcon from "@mui/icons-material/Article";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import dayjs from "dayjs";
import NavBar from "../layouts/NavBar";
import Footer from "../layouts/Footer";

const PublicProfile = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/public/${userId}`
        );
        if (res.data.status) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Button
          component={Link}
          to="/explore"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: "#1b2e35", fontWeight: "bold" }}
        >
          Back to Feed
        </Button>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#1b2e35" }} />
          </Box>
        ) : !profileData ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              User not found.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={4}>
            {/* Profile Header Card */}
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                background: "linear-gradient(to right, #ffffff, #f8fafc)"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                <Avatar
                  src={
                    profileData.user?.image
                      ? `${import.meta.env.VITE_SERVER_ENDPOINT}/avatar/${profileData.user.image}`
                      : undefined
                  }
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: "#1b2e35",
                    color: "#59e3a7",
                    fontSize: "2rem",
                    fontWeight: "bold"
                  }}
                >
                  {profileData.user?.fullName ? profileData.user.fullName.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "#1b2e35" }}>
                      {profileData.user?.fullName}
                    </Typography>
                    <Chip
                      label={profileData.user?.role === "admin" ? "Admin" : "Student"}
                      size="small"
                      sx={{
                        backgroundColor: profileData.user?.role === "admin" ? "#fed7aa" : "#e0e7ff",
                        color: profileData.user?.role === "admin" ? "#c2410c" : "#3730a3",
                        fontWeight: "bold"
                      }}
                    />
                  </Box>

                  {profileData.user?.bio && (
                    <Typography variant="body1" sx={{ mt: 1, color: "#475569" }}>
                      {profileData.user.bio}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2, flexWrap: "wrap", color: "text.secondary" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        Joined {dayjs(profileData.user?.createdAt).format("MMMM YYYY")}
                      </Typography>
                    </Box>
                    <Typography variant="caption">
                      <strong>{profileData.totalPosts}</strong> Public Posts
                    </Typography>
                    <Typography variant="caption">
                      <strong>{profileData.totalBooks}</strong> Books Listed
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Content Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(e, val) => setTabValue(val)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  icon={<ArticleIcon />}
                  iconPosition="start"
                  label={`Posts (${profileData.totalPosts})`}
                  sx={{ fontWeight: "bold" }}
                />
                <Tab
                  icon={<AutoStoriesIcon />}
                  iconPosition="start"
                  label={`Books Listed (${profileData.totalBooks})`}
                  sx={{ fontWeight: "bold" }}
                />
              </Tabs>
            </Box>

            {/* Tab 0: Public Posts */}
            {tabValue === 0 && (
              <Box>
                {profileData.posts.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                    No public posts published yet.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {profileData.posts.map((post) => (
                      <Card
                        key={post._id}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
                        }}
                      >
                        <Link
                          to={`/posts/${post._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "#1b2e35", "&:hover": { color: "#2563eb" } }}
                          >
                            {post.title}
                          </Typography>
                        </Link>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {post.description.replace(/[#*`_]/g, "")}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(post.createdAt).format("MMM D, YYYY")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ❤️ {post.likesCount} likes • 💬 {post.commentsCount} comments
                          </Typography>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {/* Tab 1: Listed Books */}
            {tabValue === 1 && (
              <Box>
                {profileData.books.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                    No books listed for sale.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {profileData.books.map((book) => (
                      <Grid item xs={12} sm={6} md={4} key={book._id}>
                        <Card sx={{ height: "100%", borderRadius: 2 }}>
                          <Box
                            component="img"
                            src={`${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${book.image}`}
                            alt={book.title}
                            sx={{ width: "100%", height: 160, objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/preview.png";
                            }}
                          />
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                              {book.title}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f766e", my: 0.5 }}>
                              ₹{book.price}
                            </Typography>
                            <Chip label={book.condition || "Good"} size="small" sx={{ fontSize: "0.75rem" }} />
                            <Box sx={{ mt: 1.5 }}>
                              <Button
                                component={Link}
                                to={`/products/${book._id}`}
                                size="small"
                                variant="outlined"
                                fullWidth
                                sx={{ textTransform: "none", borderColor: "#1b2e35", color: "#1b2e35" }}
                              >
                                View Listing
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Stack>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default PublicProfile;
