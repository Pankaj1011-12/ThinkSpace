import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const OngoingTask = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks?taskStatus=ongoing`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
            },
          }
        );
        if (response.data.status) {
          setTasks(response.data.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching ongoing tasks:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Ongoing Tasks ⏳
          </Typography>
          <Button component={Link} to="/task-management" size="small" sx={{ textTransform: "none", fontSize: "0.8rem", color: "#0f766e" }}>
            View Board
          </Button>
        </Box>

        {tasks.length > 0 ? (
          <List disablePadding>
            {tasks.slice(0, 4).map((task, index) => (
              <Box key={task._id || index}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={task.title}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem", color: "#334155" }}
                    secondary={task.deadline ? `Due: ${new Date(task.deadline).toLocaleDateString()}` : "No deadline"}
                    secondaryTypographyProps={{ fontSize: "0.78rem" }}
                  />
                </ListItem>
                {index < tasks.slice(0, 4).length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "#94a3b8" }}>
            <TaskAltIcon sx={{ fontSize: "2.5rem", mb: 1, opacity: 0.6 }} />
            <Typography variant="body2">No tasks in progress.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OngoingTask;
