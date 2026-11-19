import { Box, Button, TextField, IconButton, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import useThinkSpace from "../../../src/hooks/useThinkSpace";
import Cookies from 'js-cookie';

const CONDITIONS = ["New", "Like New", "Good", "Acceptable"];
const CATEGORIES = ["Computer Science", "Engineering", "Mathematics", "Science", "Literature", "General"];

const AddProductForm = () => {
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const onSubmit = async (data) => {
    const formPayload = new FormData();
    if (data.productimage && data.productimage[0] instanceof File) {
      formPayload.append("productimage", data.productimage[0]);
    }
    formPayload.append("title", data.title);
    formPayload.append("bookAuthor", data.bookAuthor || "");
    formPayload.append("price", data.price);
    formPayload.append("condition", data.condition || "Good");
    formPayload.append("category", data.category || "General");
    formPayload.append("contactInfo", data.contactInfo || "");
    formPayload.append("description", data.description);

    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/products`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      if (response.data.status) {
        reset();
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Book listed successfully in the Marketplace!");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message || "Failed to add book");
      }
    } catch (error) {
      console.error("Error creating book listing:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      const errMsg = error.response?.data?.message || error.message || "Something Went Wrong";
      setAlertMessage(errMsg);
    } finally {
      setLoadingStatus(false);
    }
  };

  const productImage = watch("productimage");

  let productImageUrl = null;
  if (productImage && productImage[0] && productImage[0] instanceof File) {
    try {
      productImageUrl = URL.createObjectURL(productImage[0]);
    } catch (error) {
      console.error("Error creating object URL:", error);
    }
  }

  return (
    <Box sx={{ pr: { md: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ color: "#1b2e35", mb: 2 }}>
        List a Book for Sale 📖
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
          <TextField
            label="Book Title"
            placeholder="e.g. Introduction to Algorithms"
            fullWidth
            size="small"
            {...register("title", {
              required: "Book title is required",
            })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />

          <TextField
            label="Book Author (Optional)"
            placeholder="e.g. Thomas H. Cormen"
            fullWidth
            size="small"
            {...register("bookAuthor")}
          />

          <Box>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1b2e35",
                color: "#1b2e35",
                textTransform: "none",
                fontWeight: "bold"
              }}
              fullWidth
              onClick={() => {
                document.getElementById("productimage").click();
              }}
            >
              📷 Upload Book Cover Photo
            </Button>
            <input
              id="productimage"
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              {...register("productimage", {
                required: "Book cover photo is required",
              })}
            />
            {errors.productimage && (
              <Typography color="error" variant="caption" sx={{ display: "block", mt: 0.5 }}>
                {errors.productimage.message}
              </Typography>
            )}

            {productImageUrl && (
              <Box sx={{ position: "relative", display: "inline-block", mt: 1 }}>
                <img
                  src={productImageUrl}
                  alt="Book preview"
                  width="100"
                  height="120"
                  style={{ border: "1px solid #cbd5e1", borderRadius: "6px", objectFit: "cover" }}
                />
                <IconButton
                  aria-label="delete"
                  size="small"
                  sx={{
                    position: "absolute",
                    right: "-10px",
                    top: "-10px",
                    backgroundColor: "white",
                    color: "red",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                  onClick={() => {
                    setValue("productimage", null);
                    const fileInput = document.getElementById("productimage");
                    if (fileInput) fileInput.value = "";
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          <TextField
            label="Price (in ₹ INR)"
            placeholder="e.g. 350"
            type="number"
            fullWidth
            size="small"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be 0 or greater" }
            })}
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ""}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="condition-label">Condition</InputLabel>
            <Select
              labelId="condition-label"
              label="Condition"
              defaultValue="Good"
              {...register("condition")}
            >
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              defaultValue="Computer Science"
              {...register("category")}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Contact Info / Availability (Optional)"
            placeholder="e.g. Available for handover at Campus Library"
            fullWidth
            size="small"
            {...register("contactInfo")}
          />

          <TextField
            label="Description"
            placeholder="Describe the edition, highlights, notes, or package..."
            multiline
            rows={3}
            fullWidth
            size="small"
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ""}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              backgroundColor: "#1b2e35",
              color: "white",
              fontWeight: "bold",
              py: 1.2,
              "&:hover": { backgroundColor: "#2c4955" }
            }}
            type="submit"
          >
            Publish Book Listing
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProductForm;
