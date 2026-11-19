import { Box, Card, Typography, Avatar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProfileCardDetails = ({ data }) => {
  return (
    <Box>
      <Card
        sx={{
          backgroundColor: "#1b2e35",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          color: "white"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#59e3a7",
                mb: 0.5
              }}
            >
              {data?.fullName || "User Profile"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mb: 1
              }}
            >
              {data?.email}
            </Typography>
            {data?.bio && (
              <Typography
                variant="body2"
                sx={{
                  color: "#cbd5e1",
                  mb: 1.5,
                  lineHeight: 1.5
                }}
              >
                {data.bio}
              </Typography>
            )}

            {data?._id && (
              <Button
                component={Link}
                to={`/users/${data._id}`}
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon />}
                sx={{
                  mt: 1,
                  borderColor: "#59e3a7",
                  color: "#59e3a7",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: "#4cd195",
                    backgroundColor: "rgba(89, 227, 167, 0.1)"
                  }
                }}
              >
                View Public Profile
              </Button>
            )}
          </Box>
          <Box
            sx={{
              height: "75px",
              width: "75px",
              padding: "3px",
              backgroundColor: "#2c4955",
              borderRadius: "50%",
              border: "2px solid #59e3a7",
              flexShrink: 0
            }}
          >
            <Avatar
              sx={{ width: "100%", height: "100%", bgcolor: "#0f766e", color: "white", fontWeight: "bold" }}
              alt={data?.fullName}
              src={data?.image ? `${import.meta.env.VITE_SERVER_ENDPOINT}/avatar/${data.image}` : undefined}
            >
              {data?.fullName ? data.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

ProfileCardDetails.propTypes = {
  data: PropTypes.object
};

export default ProfileCardDetails;
