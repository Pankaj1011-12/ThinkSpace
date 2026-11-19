import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import axios from "axios";
import Cookies from "js-cookie";
import { Typography, Card, CardContent, Box } from "@mui/material";
import ShowChartIcon from '@mui/icons-material/ShowChart';

const LastMonthActivity = () => {
  const [countData, setCountData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/users/last-month-count`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            },
          }
        );
        if (response.data.status) {
          setCountData(response.data.userCount || []);
        }
      } catch (error) {
        console.error("Error fetching user activity analytics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ShowChartIcon sx={{ color: "#0f766e" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            New User Registrations (30-Day Trend)
          </Typography>
        </Box>

        {countData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={countData}
              margin={{ top: 10, right: 25, bottom: 5, left: -10 }}
            >
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="New Users"
                stroke="#0f766e"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0f766e" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            <Typography variant="body2">No user registrations recorded in the last 30 days.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LastMonthActivity;
