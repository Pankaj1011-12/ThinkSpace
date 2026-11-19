import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArticleIcon from "@mui/icons-material/Article";
import TaskIcon from "@mui/icons-material/Task";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import ProfileCardDetails from "../../components/profile/profile/ProfileCardDetails";
import ActivityGrid from "../../components/profile/profile/ActivityGrid";
import useThinkSpace from "../hooks/useThinkSpace";
import RecentPost from "../../components/profile/profile/RecentPost";
import LatestProduct from "../../components/profile/profile/LatestProduct";
import OngoingTask from "../../components/profile/profile/OngoingTask";

const statCards = [
  {
    key: "totalPosts",
    label: "Published Posts",
    icon: <ArticleIcon sx={{ fontSize: "1.6rem" }} />,
    color: "#0f766e",
    bgColor: "rgba(15, 118, 110, 0.1)",
  },
  {
    key: "ongoingTasks",
    label: "Ongoing Tasks",
    icon: <TaskIcon sx={{ fontSize: "1.6rem" }} />,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  {
    key: "totalProducts",
    label: "Listed Books",
    icon: <ShoppingCartIcon sx={{ fontSize: "1.6rem" }} />,
    color: "#e11d48",
    bgColor: "rgba(225, 29, 72, 0.1)",
  },
];

const Profile = () => {
  const [data, setData] = useState(null);
  const {
    setAlertBoxOpenStatus,
    setLoadingStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStatus(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            },
          }
        );
        if (response.data.status) {
          setData(response.data.user);
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto" }}>
      {/* Top Section: Profile Card & Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} lg={7} sx={{ display: "flex" }}>
          <Box sx={{ width: "100%" }}>
            <ProfileCardDetails data={data} />
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Grid container spacing={2} sx={{ height: "100%" }}>
            {statCards.map((stat) => (
              <Grid item xs={12} sm={4} lg={12} key={stat.key}>
                <Card
                  sx={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    bgcolor: "#ffffff",
                    p: 2.2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 52,
                      height: 52,
                      borderRadius: "12px"
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", lineHeight: 1.1 }}>
                      {data ? (data[stat.key] || 0) : 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mt: 0.5 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Middle Section: Recent Posts, Ongoing Tasks, Latest Products */}
      <Grid container spacing={3} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <OngoingTask />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentPost />
        </Grid>
        <Grid item xs={12} md={4}>
          <LatestProduct />
        </Grid>
      </Grid>

      {/* Annual Study & Post Activity Heatmap */}
      <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", bgcolor: "#ffffff", p: 1 }}>
        <ActivityGrid />
      </Card>
    </Box>
  );
};

export default Profile;
