import { Grid, Box, Typography } from "@mui/material";
import LastMonthActivity from "../../../components/dashboard/LastMonthActivity";
import RoleCount from "../../../components/dashboard/RoleCount";

const Dashboard = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Platform Analytics & Activity 📊
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Real-time MongoDB aggregation metrics tracking student signups and community engagement.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <LastMonthActivity />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RoleCount />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
