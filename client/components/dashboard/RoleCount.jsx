import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Typography, Card, CardContent, Box } from "@mui/material";
import PieChartIcon from '@mui/icons-material/PieChart';

const COLORS = ["#0f766e", "#8b5cf6", "#f59e0b", "#ec4899"];

const RoleCount = () => {
  const [countData, setCountData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/users/role-count`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            },
          }
        );
        if (response.data.status) {
          setCountData(response.data.roleCounts || []);
        }
      } catch (error) {
        console.error("Error fetching role distribution:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <PieChartIcon sx={{ color: "#0f766e" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Role-Based User Distribution
          </Typography>
        </Box>

        {countData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={countData}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                label={({ role, count }) => `${role} (${count})`}
              >
                {countData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            <Typography variant="body2">No role data available yet.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleCount;
