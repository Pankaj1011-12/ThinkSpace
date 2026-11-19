import { Box, Grid, Typography } from "@mui/material";

const Task = () => {
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
            ORGANIZATION & WORKFLOW
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", color: "#1b2e35", my: 1 }}
          >
            Visual Kanban Board
          </Typography>
          <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 500, mb: 2 }}>
            Drag and drop study tasks across stages.
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.7, fontSize: "1.05rem" }}>
            Never let a project deadline sneak up on you. Organize your semester assignments into To Do, In Progress, and Completed stages with priority tags and deadline dates.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} data-aos="fade-up-left" sx={{ order: { xs: 1, md: 2 } }}>
        <Box
          component="img"
          src="/images/task.jpg"
          alt="Visual Kanban Task Organizer"
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

export default Task;
