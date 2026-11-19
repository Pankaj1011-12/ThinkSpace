import { Box, Typography } from "@mui/material";
import AddProductFrom from "../../components/profile/product/AddProductFrom";
import PreviewProduct from "../../components/profile/product/PreviewProduct";
import { useForm, FormProvider } from "react-hook-form";

const AddProduct = () => {
  const methods = useForm({
    defaultValues: {
      condition: "Good",
      category: "General",
    }
  });

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto" }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            List a Book or Study Resource 📖
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Help fellow students find textbooks and course materials at student-friendly prices.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4, alignItems: "flex-start" }}>
          <Box sx={{ flex: { xs: "1", lg: "1.4" }, width: "100%" }}>
            <AddProductFrom />
          </Box>
          <Box sx={{ flex: { xs: "1", lg: "1" }, width: "100%", position: { lg: "sticky" }, top: "20px" }}>
            <PreviewProduct />
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddProduct;
