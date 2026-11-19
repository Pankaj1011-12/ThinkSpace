import { Grid, Box, Typography, Button, Modal, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskStatus from "../../components/profile/task-management/TaskStatus";
import Task from "../../components/profile/task-management/Task";
import AddTask from "../../components/profile/task-management/AddTask";
import { useEffect, useState } from "react";
import axios from "axios";
import useThinkSpace from "../hooks/useThinkSpace";
import dayjs from "dayjs";
import { useForm, FormProvider } from "react-hook-form";
import Cookies from "js-cookie";

const TaskManager = () => {
  const [allTask, setAllTask] = useState([]);
  const [todo, setTodo] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "Moderate",
    },
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      if (response.data.status) {
        setAllTask(response.data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setTodo(allTask.filter((task) => task.taskStatus === "todo"));
    setOngoing(allTask.filter((task) => task.taskStatus === "ongoing"));
    setCompleted(allTask.filter((task) => task.taskStatus === "completed"));
  }, [allTask]);

  const onSubmit = async (data) => {
    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks`,
        { ...data, selectedDate },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );

      if (response.data.status && response.data.task) {
        setAllTask((prevTasks) => [...prevTasks, response.data.task]);
        setOpenModal(false);
        methods.reset();
        setSelectedDate(dayjs());
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Task created successfully!");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message || "Something Went Wrong");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleDrop = async (taskId, status) => {
    if (!taskId) return;
    try {
      // Optimistic update
      const updatedTasks = allTask.map((task) =>
        task._id === taskId ? { ...task, taskStatus: status } : task
      );
      setAllTask(updatedTasks);

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );

      if (!response.data.status) {
        fetchTasks(); // rollback if failed
      }
    } catch (error) {
      console.error("Error moving task:", error);
      fetchTasks();
    }
  };

  const handleDelete = async (taskId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      if (response.data.status) {
        setAllTask((prev) => prev.filter((item) => item._id !== taskId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Task deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to delete task");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto" }}>
      {/* Top Banner & Action */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Study & Project Task Manager 📋
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Drag and drop task cards across stages to track assignment deadlines and study sprints.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            bgcolor: "#0f766e",
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
            py: 1,
            boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)",
            "&:hover": { bgcolor: "#115e59" }
          }}
        >
          Add Task
        </Button>
      </Box>

      {/* 3-Column Kanban Board */}
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <TaskStatus status="todo" count={todo.length} onDrop={handleDrop}>
            {todo.map((task) => (
              <Task key={task._id} task={task} handleDelete={handleDelete} />
            ))}
          </TaskStatus>
        </Grid>

        <Grid item xs={12} md={4}>
          <TaskStatus status="ongoing" count={ongoing.length} onDrop={handleDrop}>
            {ongoing.map((task) => (
              <Task key={task._id} task={task} handleDelete={handleDelete} />
            ))}
          </TaskStatus>
        </Grid>

        <Grid item xs={12} md={4}>
          <TaskStatus status="completed" count={completed.length} onDrop={handleDrop}>
            {completed.map((task) => (
              <Task key={task._id} task={task} handleDelete={handleDelete} />
            ))}
          </TaskStatus>
        </Grid>
      </Grid>

      {/* Add Task Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <AddTask
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                onClose={() => setOpenModal(false)}
              />
            </form>
          </FormProvider>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskManager;
