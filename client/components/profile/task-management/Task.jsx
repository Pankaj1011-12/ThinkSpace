import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { Card, CardContent, Typography, Box, IconButton, Chip, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs from 'dayjs';

const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'Critical':
      return { bg: '#fee2e2', text: '#b91c1c' };
    case 'High':
      return { bg: '#ffedd5', text: '#c2410c' };
    case 'Moderate':
      return { bg: '#fef3c7', text: '#b45309' };
    default:
      return { bg: '#e0f2fe', text: '#0369a1' };
  }
};

const Task = ({ task, handleDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK_ITEM',
    item: { taskId: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.4 : 1, marginBottom: '12px', cursor: 'grab' }}>
      <Card
        sx={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: isDragging ? '0 12px 24px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
          backgroundColor: '#ffffff',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            borderColor: '#cbd5e1',
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DragIndicatorIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                {task.title}
              </Typography>
            </Box>
            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task._id);
                }}
                sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {task.description && (
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.8, mb: 1.5, fontSize: '0.85rem', lineHeight: 1.4 }}>
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
            <Chip
              label={task.priority || 'Moderate'}
              size="small"
              sx={{
                bgcolor: priorityStyle.bg,
                color: priorityStyle.text,
                fontWeight: 600,
                fontSize: '0.72rem',
                height: '22px',
              }}
            />
            {task.deadline && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b', fontSize: '0.78rem' }}>
                <CalendarTodayIcon sx={{ fontSize: '0.85rem' }} />
                <span>{dayjs(task.deadline).format('MMM D')}</span>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Task;
