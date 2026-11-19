import { Box, Grid, Typography } from "@mui/material";

const Time = () => {
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
          src="/images/time.jpg"
          alt="Time Master"
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
            CONSISTENCY & HABITS
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", color: "#1b2e35", my: 1 }}
          >
            Activity Heatmap & Streaks
          </Typography>
          <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 500, mb: 2 }}>
            Visualize daily study and posting consistency.
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.7, fontSize: "1.05rem" }}>
            Track your personal productivity across all 52 weeks of the year with our interactive contribution heatmap matrix. Celebrate milestones and build consistent learning habits throughout your semester.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Time;
