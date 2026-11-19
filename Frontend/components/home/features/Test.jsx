import { Box, Grid, Typography } from "@mui/material";

const Test = () => {
  return (
    <Grid
      container
      spacing={4}
      sx={{
        maxWidth: "1280px",
        mx: "auto",
        alignItems: "center",
        my: { xs: 4, md: 8 },
        px: { xs: 2, md: 3 }
      }}
    >
      <Grid item xs={12} md={6} data-aos="fade-up-right" sx={{ order: { xs: 2, md: 1 } }}>
        <Box sx={{ p: { xs: 1, md: 3 } }}>
          <Typography variant="overline" sx={{ color: "#0f766e", fontWeight: "bold", letterSpacing: 1.2 }}>
            COMMUNITY ACADEMIC RESOURCES
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", color: "#1b2e35", my: 1 }}
          >
            Peer Textbook Marketplace
          </Typography>
          <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 500, mb: 2 }}>
            Buy, sell, or trade course books right on campus.
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.7, fontSize: "1.05rem" }}>
            Cut textbook expenses by trading secondhand books directly with students in your department. Filter listings by condition, major, and price, with instant contact options to arrange campus meetups.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} data-aos="fade-up-left" sx={{ order: { xs: 1, md: 2 } }}>
        <Box
          component="img"
          src="/images/test.jpg"
          alt="Textbook Marketplace"
          sx={{
            width: "100%",
            maxHeight: "380px",
            borderRadius: "16px",
            objectFit: "cover",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Test;
