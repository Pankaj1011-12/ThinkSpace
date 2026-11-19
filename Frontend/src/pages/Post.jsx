import { useParams, useNavigate, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  ThumbUp,
  Favorite,
  SentimentVeryDissatisfied,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Print,
  Delete,
  Edit,
  ArrowBack
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Avatar,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Tooltip
} from "@mui/material";
import useThinkSpace from "../hooks/useThinkSpace";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { marked } from "marked";
import DOMPurify from "dompurify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const reactionsList = [
  { type: "like", icon: <ThumbUp fontSize="small" />, color: "primary", label: "Like" },
  { type: "love", icon: <Favorite fontSize="small" />, color: "error", label: "Love" },
  { type: "angry", icon: <SentimentVeryDissatisfied fontSize="small" />, color: "warning", label: "Angry" },
];

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const shareUrl = window.location.href;
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertSeverity,
    setAlertMessage,
  } = useThinkSpace();

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  // Edit Post Dialog State
  const [editPostDialogOpen, setEditPostDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState("public");

  const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
  const currentUserId = Cookies.get(import.meta.env.VITE_USER_KEY || "userId");
  const userRole = Cookies.get(import.meta.env.VITE_USER_ROLE);

  const cardRef = useRef();

  const renderMarkdown = (description) => {
    if (!description) return { __html: "" };
    const html = marked(description);
    return { __html: DOMPurify.sanitize(html) };
  };

  const fetchPost = async () => {
    setPageLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}`,
        { headers }
      );
      if (response.data.status) {
        setPost(response.data.post);
        setEditTitle(response.data.post.title);
        setEditTags(response.data.post.tags ? response.data.post.tags.join(", ") : "");
        setEditDescription(response.data.post.description);
        setEditVisibility(response.data.post.visibility || "public");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
    documentTitle: post?.title || "ThinkSpace Post",
    removeAfterPrint: true,
    contentRef: cardRef,
  });

  const handleComment = async () => {
    if (!token) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("info");
      setAlertMessage("Please log in to leave a comment!");
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}/comment`,
        { comment: commentText.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        setPost((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), response.data.comment],
          commentsCount: (prev.commentsCount || 0) + 1,
        }));
        setCommentText("");
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Comment added successfully!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}/comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c._id !== commentId),
          commentsCount: Math.max(0, (prev.commentsCount || 1) - 1),
        }));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Comment deleted");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleSaveEditComment = async (commentId) => {
    if (!token || !editedCommentText.trim()) return;
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}/comment/${commentId}`,
        { comment: editedCommentText.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.map((c) =>
            c._id === commentId ? { ...c, comment: editedCommentText.trim() } : c
          ),
        }));
        setEditingCommentId(null);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Comment updated");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to update comment");
    }
  };

  const handleReact = async (reactionType) => {
    if (!token) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("info");
      setAlertMessage("Please log in to react!");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}/reaction`,
        { reactionType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        // Refresh full post reaction data
        fetchPost();
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Failed to update reaction");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Post deleted successfully");
        navigate("/explore");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleSavePostEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}`,
        {
          title: editTitle.trim(),
          description: editDescription.trim(),
          tags: editTags,
          visibility: editVisibility,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setEditPostDialogOpen(false);
        fetchPost();
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Post updated successfully!");
      }
    } catch (err) {
      console.error("Error updating post:", err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to update post");
    }
  };

  const isPostAuthor =
    (currentUserId && post?.authorId && post.authorId.toString() === currentUserId.toString()) ||
    userRole === "admin";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
        <Button
          component={Link}
          to="/explore"
          startIcon={<ArrowBack />}
          sx={{ mb: 2, color: "#1b2e35", fontWeight: "bold" }}
          className="no-print"
        >
          Back to Community Feed
        </Button>

        {pageLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#1b2e35" }} />
          </Box>
        ) : !post ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h5" color="#1b2e35" fontWeight="bold">
              Post Not Found or Private
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This post may have been deleted or is marked as private by the author.
            </Typography>
            <Button component={Link} to="/explore" variant="contained" sx={{ mt: 3, backgroundColor: "#1b2e35" }}>
              Explore Other Posts
            </Button>
          </Card>
        ) : (
          <Card
            ref={cardRef}
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              {/* Top Bar: Author Info & Owner Controls */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    src={post.authorImage ? `${import.meta.env.VITE_SERVER_ENDPOINT}/avatar/${post.authorImage}` : undefined}
                    sx={{ bgcolor: "#1b2e35", color: "#59e3a7", width: 50, height: 50, fontWeight: "bold" }}
                  >
                    {post.author ? post.author.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Box>
                    <Link
                      to={post.authorId ? `/users/${post.authorId}` : "#"}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ "&:hover": { color: "#2563eb", textDecoration: "underline" } }}
                      >
                        {post.author || "ThinkSpace Author"}
                      </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      Published {dayjs(post.createdAt).format("MMM D, YYYY • h:mm A")}
                      {post.visibility === "private" && " • 🔒 Private Post"}
                    </Typography>
                  </Box>
                </Box>

                {/* Owner Actions */}
                {isPostAuthor && (
                  <Stack direction="row" spacing={1} className="no-print">
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      variant="outlined"
                      onClick={() => setEditPostDialogOpen(true)}
                      sx={{ borderColor: "#1b2e35", color: "#1b2e35" }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={handleDeletePost}
                    >
                      Delete
                    </Button>
                  </Stack>
                )}
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#1b2e35", mb: 2, lineHeight: 1.3 }}
              >
                {post.title}
              </Typography>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 0.5 }}>
                  {post.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag.startsWith("#") ? tag : `#${tag}`}
                      size="small"
                      sx={{
                        backgroundColor: "#f1f5f9",
                        color: "#334155",
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Stack>
              )}

              {/* Share & Print Toolbar */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3, p: 1, backgroundColor: "#f8fafc", borderRadius: 1.5 }}
                className="no-print"
              >
                <Typography variant="caption" fontWeight="bold" sx={{ color: "#64748b", mr: 1 }}>
                  Share:
                </Typography>
                <FacebookShareButton url={shareUrl} quote={post.title}>
                  <Facebook sx={{ fontSize: 24, cursor: "pointer", color: "#1877F2" }} />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={post.title}>
                  <Twitter sx={{ fontSize: 24, cursor: "pointer", color: "#1DA1F2" }} />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={post.title} source={shareUrl}>
                  <LinkedIn sx={{ fontSize: 24, cursor: "pointer", color: "#0077B5" }} />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl} title={post.title} separator=" - ">
                  <WhatsApp sx={{ fontSize: 24, cursor: "pointer", color: "#25D366" }} />
                </WhatsappShareButton>
                <Tooltip title="Print Article">
                  <IconButton size="small" onClick={handlePrint} sx={{ color: "#475569" }}>
                    <Print fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Post Description (Markdown Rendered) */}
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  color: "#1e293b",
                  "& h1, & h2, & h3": { color: "#1b2e35", my: 2 },
                  "& p": { mb: 2 },
                  "& pre": { backgroundColor: "#f1f5f9", p: 2, borderRadius: 1.5, overflowX: "auto" }
                }}
                dangerouslySetInnerHTML={renderMarkdown(post.description)}
              />

              <Divider sx={{ my: 4 }} />

              {/* Reactions Bar */}
              <Box sx={{ mb: 4 }} className="no-print">
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: "#475569" }}>
                  Reactions & Likes:
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  {reactionsList.map((reaction) => {
                    const count = post.reactions
                      ? post.reactions.filter((r) => r.reaction === reaction.type).length
                      : 0;
                    return (
                      <Button
                        key={reaction.type}
                        variant="outlined"
                        color={reaction.color}
                        startIcon={reaction.icon}
                        onClick={() => handleReact(reaction.type)}
                        sx={{
                          borderRadius: 5,
                          px: 2,
                          textTransform: "none",
                          fontWeight: "bold"
                        }}
                      >
                        {reaction.label} ({count})
                      </Button>
                    );
                  })}
                </Stack>
              </Box>

              {/* Comments Section */}
              <Box sx={{ mt: 4 }} className="no-print">
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b2e35", mb: 2 }}>
                  Comments ({post.comments ? post.comments.length : 0})
                </Typography>

                {/* Comment Input */}
                <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Share your thoughts or feedback..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    multiline
                    minRows={2}
                    sx={{ backgroundColor: "white" }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleComment}
                    sx={{
                      backgroundColor: "#1b2e35",
                      color: "white",
                      px: 3,
                      "&:hover": { backgroundColor: "#2c4955" }
                    }}
                  >
                    Post
                  </Button>
                </Box>

                {/* Comments List */}
                <Stack spacing={2}>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => {
                      const isCommentAuthor =
                        currentUserId &&
                        comment.commenter_id &&
                        comment.commenter_id.toString() === currentUserId.toString();
                      const canDelete = isCommentAuthor || isPostAuthor;

                      return (
                        <Card
                          key={comment._id}
                          variant="outlined"
                          sx={{ p: 2, borderRadius: 2, backgroundColor: "#ffffff" }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box sx={{ display: "flex", gap: 1.5 }}>
                              <Avatar
                                src={
                                  comment.commenter_image
                                    ? `${import.meta.env.VITE_SERVER_ENDPOINT}/avatar/${comment.commenter_image}`
                                    : undefined
                                }
                                sx={{ bgcolor: "#334155", width: 36, height: 36, fontSize: "0.9rem" }}
                              >
                                {comment.commenter ? comment.commenter.charAt(0).toUpperCase() : "U"}
                              </Avatar>
                              <Box>
                                <Link
                                  to={comment.commenter_id ? `/users/${comment.commenter_id}` : "#"}
                                  style={{ textDecoration: "none", color: "inherit" }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                    sx={{ "&:hover": { textDecoration: "underline" } }}
                                  >
                                    {comment.commenter || "Member"}
                                  </Typography>
                                </Link>
                                <Typography variant="caption" color="text.secondary">
                                  {dayjs(comment.createdAt).fromNow()}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Comment Actions (Delete / Edit) */}
                            {canDelete && (
                              <Box>
                                {isCommentAuthor && editingCommentId !== comment._id && (
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setEditingCommentId(comment._id);
                                      setEditedCommentText(comment.comment);
                                    }}
                                  >
                                    <Edit fontSize="small" sx={{ fontSize: 16 }} />
                                  </IconButton>
                                )}
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  <Delete fontSize="small" sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                            )}
                          </Box>

                          {/* Comment Body / Edit Field */}
                          {editingCommentId === comment._id ? (
                            <Box sx={{ mt: 1.5 }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={editedCommentText}
                                onChange={(e) => setEditedCommentText(e.target.value)}
                              />
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleSaveEditComment(comment._id)}
                                  sx={{ backgroundColor: "#1b2e35" }}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="small"
                                  color="inherit"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ mt: 1, color: "#334155", pl: 6 }}>
                              {comment.comment}
                            </Typography>
                          )}
                        </Card>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No comments yet. Start the conversation!
                    </Typography>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Edit Post Modal */}
      <Dialog
        open={editPostDialogOpen}
        onClose={() => setEditPostDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1b2e35", color: "white" }}>
          Edit Post
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Post Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Tags (comma-separated, e.g. #study, #exam)"
              fullWidth
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Visibility</InputLabel>
              <Select
                value={editVisibility}
                label="Visibility"
                onChange={(e) => setEditVisibility(e.target.value)}
              >
                <MenuItem value="public">🌍 Public (Community Feed)</MenuItem>
                <MenuItem value="private">🔒 Private (Only Me)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description (Markdown supported)"
              fullWidth
              multiline
              rows={8}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditPostDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePostEdit}
            sx={{ backgroundColor: "#1b2e35", "&:hover": { backgroundColor: "#2c4955" } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Post;
