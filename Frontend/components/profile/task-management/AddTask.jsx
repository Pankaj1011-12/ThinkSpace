import {
  Box,
  TextField,
  Button,
  Typography,
  ButtonGroup,
  FormHelperText,
  Stack,
  IconButton
} from "@mui/material";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useFormContext, Controller } from "react-hook-form";
import CloseIcon from '@mui/icons-material/Close';

const priorities = ["Low", "Moderate", "High", "Critical"];

const AddTask = ({ setSelectedDate, selectedDate, onClose }) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Box
      sx={{
        backgroundColor: "#1b2e35",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "92%", sm: "540px" },
        maxWidth: "540px",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        p: { xs: 2.5, sm: 3.5 },
        color: "white"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
          Create New Task 🎯
        </Typography>
        {onClose && (
          <IconButton size="small" onClick={onClose} sx={{ color: "rgba(255,255,255,0.7)" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          variant="outlined"
          label="Task Title"
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "#59e3a7" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#59e3a7" },
          }}
          {...register("title", { required: "Task title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              setValue("date", newDate);
            }}
            label="Deadline Date"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "#59e3a7" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#59e3a7" },
              "& .MuiIconButton-root": { color: "#59e3a7" },
              "& .MuiInputBase-input": { color: "white" }
            }}
          />
        </LocalizationProvider>

        <TextField
          multiline
          rows={3}
          label="Description / Checklist"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "#59e3a7" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#59e3a7" },
          }}
          variant="outlined"
          {...register("description", {
            required: "Task description is required",
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "rgba(255, 255, 255, 0.85)" }}>
            Priority Level
          </Typography>
          <Controller
            name="priority"
            control={control}
            rules={{ required: "Please select a priority" }}
            defaultValue="Moderate"
            render={({ field }) => (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {priorities.map((lvl) => {
                  const isSelected = (field.value || "Moderate") === lvl;
                  return (
                    <Button
                      key={lvl}
                      type="button"
                      size="small"
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => setValue("priority", lvl)}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: isSelected ? "#0f766e" : "rgba(255,255,255,0.3)",
                        backgroundColor: isSelected ? "#0f766e" : "transparent",
                        color: isSelected ? "white" : "rgba(255,255,255,0.8)",
                        "&:hover": {
                          backgroundColor: isSelected ? "#115e59" : "rgba(255,255,255,0.1)",
                        }
                      }}
                    >
                      {lvl}
                    </Button>
                  );
                })}
              </Stack>
            )}
          />
          {errors.priority && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.priority.message}</FormHelperText>
          )}
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 1,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            borderRadius: "10px",
            color: "white",
            backgroundColor: "#0f766e",
            "&:hover": { backgroundColor: "#115e59" },
          }}
        >
          Add Task to Board
        </Button>
      </Box>
    </Box>
  );
};

AddTask.propTypes = {
  setSelectedDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]).isRequired,
  onClose: PropTypes.func,
};

export default AddTask;
