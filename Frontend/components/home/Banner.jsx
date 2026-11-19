import { useState } from 'react';
import { Box, Grid, TextField, Typography, Stack, Chip, Button, InputAdornment } from '@mui/material';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import SearchIcon from '@mui/icons-material/Search';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate, Link } from 'react-router-dom';

const Banner = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/explore");
        }
    };

    const handleTopicClick = (topic) => {
        navigate(`/explore?search=${encodeURIComponent(topic)}`);
    };

    return (
        <Grid minHeight="85vh" maxWidth="1280px" mx="auto" container spacing={4} justifyContent="center" alignItems="center" sx={{ px: { xs: 2, md: 3 }, py: 4 }}>
            <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#0f766e", mb: 1 }}>
                    <ConnectWithoutContactIcon />
                    <Typography variant="subtitle2" fontWeight="bold">Connecting Ideas, Inspiring Perspectives</Typography>
                </Box>
                <Typography
                    sx={{
                        fontFamily: "Platypi, sans-serif",
                        color: "#1b2e35",
                        fontWeight: "bold",
                        lineHeight: 1.1,
                        my: 2
                    }}
                    variant="h2"
                    component="h1"
                >
                    ThinkSpace
                </Typography>
                <Typography sx={{ color: "#475569", fontSize: "1.1rem", lineHeight: 1.6, mb: 3 }}>
                    A collaborative platform for students and creators. Share thoughts in markdown, manage study tasks on a Kanban board, and browse or sell textbooks in the campus marketplace.
                </Typography>

                {/* Search Bar */}
                <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
                    <TextField
                        placeholder="Search posts, topics, or books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="medium"
                        fullWidth
                        sx={{ maxWidth: "480px", backgroundColor: "white" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#64748b" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: "#1b2e35", "&:hover": { backgroundColor: "#2c4955" } }}
                                    >
                                        Search
                                    </Button>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                {/* Quick Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Button
                        component={Link}
                        to="/explore"
                        variant="contained"
                        startIcon={<DynamicFeedIcon />}
                        sx={{
                            backgroundColor: "#1b2e35",
                            color: "white",
                            fontWeight: "bold",
                            px: 2.5,
                            py: 1,
                            "&:hover": { backgroundColor: "#2c4955" }
                        }}
                    >
                        Community Feed
                    </Button>
                    <Button
                        component={Link}
                        to="/books"
                        variant="outlined"
                        startIcon={<MenuBookIcon />}
                        sx={{
                            borderColor: "#1b2e35",
                            color: "#1b2e35",
                            fontWeight: "bold",
                            px: 2.5,
                            py: 1,
                            "&:hover": { borderColor: "#1b2e35", backgroundColor: "#f1f5f9" }
                        }}
                    >
                        Book Marketplace
                    </Button>
                </Stack>

                {/* Popular Topic Chips */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: "#64748b" }}>
                        Popular:
                    </Typography>
                    {["machine-learning", "productivity", "algorithms", "web-dev", "books"].map((topic) => (
                        <Chip
                            key={topic}
                            label={`#${topic}`}
                            clickable
                            size="small"
                            onClick={() => handleTopicClick(topic)}
                            sx={{ backgroundColor: "#e2e8f0", color: "#1e293b", fontWeight: 500 }}
                        />
                    ))}
                </Box>
            </Grid>

            <Grid item xs={12} md={6}>
                <Box
                    component="img"
                    src="/images/banner.jpg"
                    alt="ThinkSpace Platform"
                    sx={{
                        width: "100%",
                        maxHeight: "450px",
                        objectFit: "cover",
                        borderRadius: 3,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default Banner;