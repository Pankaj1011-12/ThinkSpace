import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  ListItemAvatar,
  Box,
  Button
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import MenuBookIcon from '@mui/icons-material/MenuBook';

const LatestProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/products?limit=5&sort=createdAt`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            },
          }
        );
        if (response.data.status) {
          setProducts(response.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching latest products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
            My Listed Books 📚
          </Typography>
          <Button component={Link} to="/my-product" size="small" sx={{ textTransform: "none", fontSize: "0.8rem", color: "#0f766e" }}>
            View All
          </Button>
        </Box>

        {products.length > 0 ? (
          <List disablePadding>
            {products.slice(0, 4).map((product, index) => (
              <Box key={product._id || index}>
                <ListItem
                  component={Link}
                  to={`/products/${product._id}`}
                  sx={{
                    px: 0,
                    py: 1,
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "#0f766e" }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      alt={product.title}
                      src={`${import.meta.env.VITE_SERVER_ENDPOINT}/productimage/${product.image}`}
                      sx={{ width: 42, height: 42, mr: 1, borderRadius: "8px", bgcolor: "#f1f5f9" }}
                    >
                      <MenuBookIcon sx={{ color: "#94a3b8" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={product.title}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem", noWrap: true }}
                    secondary={`$${product.price} • ${product.condition || "Good"}`}
                    secondaryTypographyProps={{ fontSize: "0.78rem" }}
                  />
                </ListItem>
                {index < products.slice(0, 4).length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "#94a3b8" }}>
            <MenuBookIcon sx={{ fontSize: "2.5rem", mb: 1, opacity: 0.6 }} />
            <Typography variant="body2">No books listed yet.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestProduct;
