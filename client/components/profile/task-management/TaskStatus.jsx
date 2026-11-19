import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { Box, Typography, Chip } from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const columnConfig = {
  todo: {
    label: "To Do",
    color: "#475569",
    bgColor: "#f1f5f9",
    accent: "#64748b",
    icon: <PlaylistAddCheckIcon sx={{ fontSize: "1.3rem" }} />
  },
  ongoing: {
    label: "In Progress",
    color: "#0f766e",
    bgColor: "#ccfbf1",
    accent: "#0d9488",
    icon: <HourglassTopIcon sx={{ fontSize: "1.3rem" }} />
  },
  completed: {
    label: "Completed",
    color: "#15803d",
    bgColor: "#dcfce7",
    accent: "#16a34a",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: "1.3rem" }} />
  }
};

const TaskStatus = ({ status, onDrop, count, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK_ITEM',
    drop: (item) => onDrop(item.taskId, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const cfg = columnConfig[status] || columnConfig.todo;

  return (
    <Box
      ref={drop}
      sx={{
        bgcolor: isOver ? "rgba(15, 118, 110, 0.08)" : "#f8fafc",
        border: isOver ? "2px dashed #0f766e" : "1px solid #e2e8f0",
        borderRadius: "16px",
        p: 2,
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease"
      }}
    >
      {/* Column Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, pb: 1.5, borderBottom: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: cfg.color }}>
          {cfg.icon}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem" }}>
            {cfg.label}
          </Typography>
        </Box>
        <Chip
          label={count || 0}
          size="small"
          sx={{
            bgcolor: cfg.bgColor,
            color: cfg.color,
            fontWeight: 700,
            fontSize: "0.8rem",
            height: "22px"
          }}
        />
      </Box>

      {/* Task Cards Container */}
      <Box sx={{ flex: 1 }}>
        {children}
        {count === 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "120px",
              border: "1px dashed #cbd5e1",
              borderRadius: "12px",
              color: "#94a3b8",
              fontSize: "0.88rem"
            }}
          >
            Drop tasks here
          </Box>
        )}
      </Box>
    </Box>
  );
};

TaskStatus.propTypes = {
  status: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
  count: PropTypes.number,
  children: PropTypes.node
};

export default TaskStatus;
