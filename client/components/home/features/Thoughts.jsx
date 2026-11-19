import { Box, Grid, Typography } from "@mui/material";

const Thoughts = () => {
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
      <Grid item xs={12} md={6} data-aos="fade-up-right">
        <Box
          component="img"
          src="/images/thoughts.jpg"
          alt="Insight Exchange"
          sx={{
            width: "100%",
            maxHeight: "380px",
            borderRadius: "16px",
            objectFit: "cover",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} data-aos="fade-up-left">
        <Box sx={{ p: { xs: 1, md: 3 } }}>
          <Typography variant="overline" sx={{ color: "#0f766e", fontWeight: "bold", letterSpacing: 1.2 }}>
            KNOWLEDGE COLLABORATION
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", color: "#1b2e35", my: 1 }}
          >
            Insight Exchange
          </Typography>
          <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 500, mb: 2 }}>
            Share ideas in markdown and gain peer perspectives.
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.7, fontSize: "1.05rem" }}>
            Engage with a vibrant student community by publishing study guides, technical summaries, and asking thoughtful questions. Discussions feature emoji reactions, comments, and printable PDFs to review offline.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Thoughts;
