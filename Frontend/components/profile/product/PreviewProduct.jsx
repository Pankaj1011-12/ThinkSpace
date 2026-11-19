import { Box, Typography, Card, CardMedia, CardContent, Chip, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const getConditionColor = (cond) => {
  switch (cond) {
    case "New": return { bg: "#dcfce7", color: "#15803d" };
    case "Like New": return { bg: "#e0e7ff", color: "#4338ca" };
    case "Good": return { bg: "#fef9c3", color: "#a16207" };
    case "Acceptable": return { bg: "#fee2e2", color: "#b91c1c" };
    default: return { bg: "#f1f5f9", color: "#475569" };
  }
};

const PreviewProduct = () => {
  const { watch } = useFormContext();
  const title = watch("title") || "Book Title Preview";
  const bookAuthor = watch("bookAuthor");
  const price = watch("price");
  const condition = watch("condition") || "Good";
  const category = watch("category") || "General";
  const description = watch("description") || "Book description and details will appear here as you type...";
  const contactInfo = watch("contactInfo");
  const productImage = watch("productimage");

  let productImageUrl = null;
  if (productImage && productImage[0] && productImage[0] instanceof File) {
    try {
      productImageUrl = URL.createObjectURL(productImage[0]);
    } catch (error) {
      console.error("Error creating object URL:", error);
    }
  }

  const condStyle = getConditionColor(condition);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", mb: 1.5 }}>
        Live Marketplace Card Preview
      </Typography>

      <Card
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          overflow: "hidden",
          bgcolor: "#ffffff"
        }}
      >
        {productImageUrl ? (
          <CardMedia
            component="img"
            height="220"
            image={productImageUrl}
            alt={title}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 180,
              bgcolor: "#f1f5f9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              gap: 1
            }}
          >
            <AutoStoriesIcon sx={{ fontSize: "3rem" }} />
            <Typography variant="caption">Book cover photo preview</Typography>
          </Box>
        )}

        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip
              label={condition}
              size="small"
              sx={{ bgcolor: condStyle.bg, color: condStyle.color, fontWeight: 700, fontSize: "0.75rem" }}
            />
            <Chip
              label={category}
              size="small"
              sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "0.75rem" }}
            />
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5, lineHeight: 1.3 }}>
            {title}
          </Typography>

          {bookAuthor && (
            <Typography variant="body2" sx={{ color: "#64748b", mb: 1.5 }}>
              by {bookAuthor}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1.5 }}>
            <LocalOfferIcon sx={{ color: "#0f766e", fontSize: "1.2rem" }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f766e" }}>
              ${price ? Number(price).toFixed(2) : "0.00"}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {description}
          </Typography>

          {contactInfo && (
            <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid #f1f5f9" }}>
              <Typography variant="caption" sx={{ color: "#0f766e", fontWeight: 600 }}>
                Contact Seller: {contactInfo}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreviewProduct;
