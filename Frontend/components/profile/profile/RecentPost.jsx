import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import ArticleIcon from '@mui/icons-material/Article';

const RecentPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/posts?limit=5&sort=createdAt`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            },
          }
        );
        if (response.data.status) {
          setPosts(response.data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
            My Recent Posts 📝
          </Typography>
          <Button component={Link} to="/my-post" size="small" sx={{ textTransform: "none", fontSize: "0.8rem", color: "#0f766e" }}>
            View All
          </Button>
        </Box>

        {posts.length > 0 ? (
          <List disablePadding>
            {posts.slice(0, 4).map((post, index) => (
              <Box key={post._id || index}>
                <ListItem
                  component={Link}
                  to={`/posts/${post._id}`}
                  sx={{
                    px: 0,
                    py: 1,
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "#0f766e" }
                  }}
                >
                  <ListItemText
                    primary={post.title}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      noWrap: true
                    }}
                    secondary={`Posted: ${new Date(post.createdAt).toLocaleDateString()}`}
                    secondaryTypographyProps={{ fontSize: "0.78rem" }}
                  />
                </ListItem>
                {index < posts.slice(0, 4).length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "#94a3b8" }}>
            <ArticleIcon sx={{ fontSize: "2.5rem", mb: 1, opacity: 0.6 }} />
            <Typography variant="body2">No posts created yet.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPost;
