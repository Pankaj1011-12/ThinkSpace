import {
  Box,
  TextField,
  Button,
  InputBase,
  Chip,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Tabs,
  Tab
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SimpleMdeReact from "react-simplemde-editor";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "easymde/dist/easymde.min.css";
import useThinkSpace from "../hooks/useThinkSpace";
import axios from "axios";
import Cookies from "js-cookie";
import PublishIcon from '@mui/icons-material/Publish';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';

const AddPost = () => {
  const navigate = useNavigate();
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkSpace();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();

  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [activeTab, setActiveTab] = useState(0); // 0 = Write, 1 = Preview

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && tag.trim() !== "") {
      event.preventDefault();
      const trimmed = tag.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTag("");
      clearErrors("tags");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
  };

  const renderMarkdown = () => {
    const html = marked(description || "*Nothing to preview yet. Start typing your post markdown above...*");
    return { __html: DOMPurify.sanitize(html) };
  };

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      setError("tags", {
        type: "manual",
        message: "Please add at least one tag (type a tag and press Enter)",
      });
      return;
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length === 0) {
      setError("description", {
        type: "manual",
        message: "Post content / description cannot be empty",
      });
      return;
    }

    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`,
        {
          title: data.title.trim(),
          tags,
          description: trimmedDescription,
          visibility,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );

      if (response.data.status) {
        reset();
        setTags([]);
        setDescription("");
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Post published successfully!");
        navigate("/my-post");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message || "Failed to publish post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message || "Something Went Wrong");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Create Academic Post ✍️
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Share notes, research summaries, and code snippets in Markdown with fellow students.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Title & Visibility row */}
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <TextField
                  label="Post Title"
                  placeholder="e.g. Master-Theorem Explained with Solved Examples"
                  fullWidth
                  {...register("title", { required: "Title is required" })}
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ""}
                  sx={{ flex: 1 }}
                />

                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel id="visibility-label">Visibility</InputLabel>
                  <Select
                    labelId="visibility-label"
                    value={visibility}
                    label="Visibility"
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <MenuItem value="public">🌐 Public (Feed)</MenuItem>
                    <MenuItem value="private">🔒 Private (Only Me)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Tags Input */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>
                  Tags (Type tag & press Enter)
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cbd5e1",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                    backgroundColor: "#ffffff",
                    "&:focus-within": {
                      borderColor: "#0f766e",
                      boxShadow: "0 0 0 2px rgba(15, 118, 110, 0.15)"
                    }
                  }}
                >
                  {tags.map((item, index) => (
                    <Chip
                      key={index}
                      label={`#${item}`}
                      size="small"
                      sx={{
                        backgroundColor: "#0f766e",
                        color: "white",
                        fontWeight: 600,
                        "& .MuiChip-deleteIcon": { color: "rgba(255,255,255,0.8)" }
                      }}
                      onDelete={() => handleRemoveTag(index)}
                    />
                  ))}

                  <InputBase
                    sx={{
                      flex: 1,
                      minWidth: "140px",
                      fontSize: "0.92rem",
                      padding: "2px"
                    }}
                    placeholder={tags.length === 0 ? "Type tag name and hit Enter..." : "Add another tag..."}
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </Box>
                {errors.tags && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: "block" }}>
                    {errors.tags.message}
                  </Typography>
                )}
              </Box>

              {/* Editor Tabs: Write vs Preview */}
              <Box>
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                >
                  <Tab icon={<EditNoteIcon />} iconPosition="start" label="Write Markdown" sx={{ textTransform: "none", fontWeight: 600 }} />
                  <Tab icon={<VisibilityIcon />} iconPosition="start" label="Live Preview" sx={{ textTransform: "none", fontWeight: 600 }} />
                </Tabs>

                {activeTab === 0 ? (
                  <Box>
                    <SimpleMdeReact
                      id="description"
                      value={description}
                      onChange={setDescription}
                      options={{
                        placeholder: "Write your study notes, tutorial, code snippets, or thoughts here...",
                        spellChecker: false,
                        minHeight: "320px",
                      }}
                    />
                    {errors.description && (
                      <Typography color="error" variant="caption">
                        {errors.description.message}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      minHeight: "320px",
                      bgcolor: "#ffffff",
                      lineHeight: 1.8,
                      "& img": { maxWidth: "100%", borderRadius: "8px" },
                      "& pre": { bgcolor: "#f1f5f9", p: 2, borderRadius: "8px", overflowX: "auto" }
                    }}
                    dangerouslySetInnerHTML={renderMarkdown()}
                  />
                )}
              </Box>

              <Divider />

              {/* Submit Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<PublishIcon />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "10px",
                    bgcolor: "#0f766e",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)",
                    "&:hover": { bgcolor: "#115e59" }
                  }}
                >
                  Publish Post
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddPost;
