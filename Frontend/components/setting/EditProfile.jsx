import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import useThinkSpace from "../../src/hooks/useThinkSpace";

const EditProfile = () => {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } = useThinkSpace();

  const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (res.data.status) {
          setFullName(res.data.user.fullName || "");
          setBio(res.data.user.bio || "");
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/profile`,
        { fullName: fullName.trim(), bio: bio.trim() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b2e35", mb: 2 }}>
          Edit Profile Information 👤
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            size="small"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            label="Biography"
            placeholder="Tell fellow students about your interests, studies, or projects..."
            size="small"
            multiline
            rows={4}
            fullWidth
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#1b2e35",
              color: "white",
              fontWeight: "bold",
              py: 1,
              "&:hover": { backgroundColor: "#2c4955" }
            }}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditProfile;
