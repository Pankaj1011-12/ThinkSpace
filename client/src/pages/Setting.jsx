import { Grid, Box, Typography } from "@mui/material";
import ChangePassword from "../../components/setting/ChangePassword";
import EditProfile from "../../components/setting/EditProfile";

const Setting = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: "#1b2e35", mb: 3 }}>
        Account Settings ⚙️
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EditProfile />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChangePassword />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Setting;
