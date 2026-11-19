import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  Avatar,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { IoSchoolSharp } from "react-icons/io5";
import { BiSolidInstitution } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useThinkSpace from "../hooks/useThinkSpace";
import NavBar from "../layouts/NavBar";
import Footer from "../layouts/Footer";

const plans = [
  {
    title: "Student",
    price: "Free",
    period: "Forever",
    badge: "Most Popular",
    features: [
      "Full access to Community Feed",
      "Unlimited Markdown note creation",
      "Kanban task manager with drag-and-drop",
      "Browse and contact textbook sellers",
      "Public profile and activity heatmap"
    ],
    icon: <PiStudentBold fontSize="40px" />,
    gradient: "linear-gradient(135deg, #1b2e35 0%, #2d4a54 100%)",
  },
  {
    title: "Educator / Teacher",
    price: "$19",
    period: "/month",
    badge: "Recommended for Teachers",
    features: [
      "All Student features included",
      "Create study groups & class tags",
      "Pinned educational resources & polls",
      "Priority student listing badge",
      "Direct group notification broadcasts"
    ],
    icon: <IoSchoolSharp fontSize="40px" />,
    gradient: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
  },
  {
    title: "Institution / Campus",
    price: "$99",
    period: "/month",
    badge: "For Universities",
    features: [
      "All Educator tier features",
      "Campus-wide textbook exchange hub",
      "Custom department & course categories",
      "Full administrative analytics dashboard",
      "Dedicated 24/7 priority support"
    ],
    icon: <BiSolidInstitution fontSize="40px" />,
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
];

const Subscription = () => {
  const navigate = useNavigate();
  const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } = useThinkSpace();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activePlan, setActivePlan] = useState("Student");

  const handleSelectPlan = (plan) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setSelectedPlan(plan);
    setConfirmOpen(true);
  };

  const handleConfirmSubscribe = () => {
    setActivePlan(selectedPlan.title);
    setConfirmOpen(false);
    setAlertBoxOpenStatus(true);
    setAlertSeverity("success");
    setAlertMessage(`Successfully activated ${selectedPlan.title} membership tier!`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, textTransform: "none", color: "#475569", fontWeight: 600 }}
        >
          Back to Home
        </Button>

        <Box sx={{ textAlign: "center", mb: 6, maxWidth: "700px", mx: "auto" }}>
          <Typography
            variant="overline"
            sx={{ color: "#0f766e", fontWeight: "bold", letterSpacing: 1.5, fontSize: "0.85rem" }}
          >
            FLEXIBLE ACADEMIC PLANS
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: "#1e293b", mt: 1, mb: 2 }}>
            Simple, Transparent Membership
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", fontSize: "1.1rem" }}>
            Whether you are an individual learner, educator, or university campus, ThinkSpace equips you with collaborative productivity tools.
          </Typography>
        </Box>

        <Grid container spacing={3.5} justifyContent="center" alignItems="stretch">
          {plans.map((plan) => {
            const isCurrent = activePlan === plan.title;
            return (
              <Grid item key={plan.title} xs={12} md={4} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: "18px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    background: plan.gradient,
                    color: "#ffffff",
                    p: 3.5,
                    position: "relative",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                    }
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          color: "#ffffff",
                          backdropFilter: "blur(8px)"
                        }}
                      >
                        {plan.icon}
                      </Avatar>
                      <Chip
                        label={plan.badge}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.75rem"
                        }}
                      />
                    </Box>

                    <CardHeader
                      disableTypography
                      title={
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                          {plan.title}
                        </Typography>
                      }
                      sx={{ p: 0, mb: 1.5 }}
                    />

                    <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "white" }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: "rgba(255, 255, 255, 0.75)", ml: 0.8 }}>
                        {plan.period}
                      </Typography>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                        {plan.features.map((feature, i) => (
                          <Box
                            component="li"
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.2,
                              mb: 1.5,
                              color: "rgba(255, 255, 255, 0.9)"
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: "1.1rem", color: "#59e3a7", mt: "3px", flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleSelectPlan(plan)}
                    sx={{
                      mt: 4,
                      bgcolor: isCurrent ? "#59e3a7" : "#ffffff",
                      color: isCurrent ? "#1b2e35" : "#1b2e35",
                      fontWeight: 700,
                      borderRadius: "12px",
                      py: 1.2,
                      textTransform: "none",
                      fontSize: "0.95rem",
                      "&:hover": {
                        bgcolor: isCurrent ? "#4cd195" : "#f1f5f9",
                      }
                    }}
                  >
                    {isCurrent ? "Active Plan" : `Choose ${plan.title}`}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Confirmation Modal */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: "#1b2e35" }}>
            Confirm Plan Activation
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
              Are you sure you want to activate the <strong>{selectedPlan?.title}</strong> tier?
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Price: {selectedPlan?.price} {selectedPlan?.period}. You can upgrade or switch back anytime.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: "none", color: "#64748b" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmSubscribe}
              sx={{ bgcolor: "#0f766e", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#115e59" } }}
            >
              Activate Now
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default Subscription;
