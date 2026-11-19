import { useState } from "react";
import { Box, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/newsletter`,
        { email: email.trim() }
      );
      if (res.data.status) {
        setStatus({ type: "success", message: res.data.message || "Thank you for subscribing to ThinkSpace!" });
        setEmail("");
      } else {
        setStatus({ type: "error", message: res.data.message || "Subscription failed." });
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatus({ type: "error", message: err.response?.data?.message || "Could not connect to server. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1b2e35",
        borderRadius: "16px",
        maxWidth: "1280px",
        margin: "3rem auto",
        padding: { xs: "2rem", md: "3rem" },
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 3,
        }}
      >
        <Box sx={{ maxWidth: "600px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#59e3a7", mb: 1 }}>
            <MarkEmailReadIcon />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
              STAY IN THE LOOP
            </Typography>
          </Box>
          <Typography variant="h4" component="h2" sx={{ color: "white", fontWeight: "bold", mb: 1.5 }}>
            Subscribe to our Academic Newsletter
          </Typography>
          <Typography variant="body1" sx={{ color: "#94a3b8", lineHeight: 1.6 }}>
            Get weekly highlights of student discussion threads, textbook listings, and study productivity tips delivered right to your inbox.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubscribe} sx={{ width: { xs: "100%", md: "420px" } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
            <TextField
              placeholder="Enter your student email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "10px",
                },
                "& .MuiInputBase-input": {
                  color: "#1e293b",
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#0f766e",
                color: "white",
                fontWeight: "bold",
                borderRadius: "10px",
                px: 3,
                py: 1,
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "#115e59" },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Subscribe"}
            </Button>
          </Box>

          {status && (
            <Alert
              severity={status.type}
              sx={{ mt: 2, borderRadius: "8px", py: 0.5, fontSize: "0.88rem" }}
              onClose={() => setStatus(null)}
            >
              {status.message}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Newsletter;
