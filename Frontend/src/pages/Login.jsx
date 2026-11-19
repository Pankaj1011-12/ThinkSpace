import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import useThinkSpace from "../hooks/useThinkSpace";
import AlertBox from "../../components/common/AlertBox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  // alert message
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useThinkSpace();
  // form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  // form submit
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/login`,
        data
      );
      if (response.data.status) {
        Cookies.set(import.meta.env.VITE_TOKEN_KEY, response.data.token, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES || 1),
          path: "/",
        });
        Cookies.set(import.meta.env.VITE_USER_ROLE, response.data.user.role, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES || 1),
          path: "/",
        });
        Cookies.set(import.meta.env.VITE_USER_KEY || "userId", response.data.user._id, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES || 1),
          path: "/",
        });
        if (response.data.user.role === "user") {
          navigate("/explore");
        } else if (response.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage("Something Went Wrong");
        }
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      const errMsg = error.response?.data?.message || error.message || "Something Went Wrong";
      setAlertMessage(errMsg);
    }
  };

  // check if user is already logged in
  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
    if (token && role) {
      if (role === "user") {
        navigate("/profile");
      } else if (role === "admin") {
        navigate("/dashboard");
      }
    } else {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
    }
  }, []);

  return (
    <>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8fafc",
            p: 4,
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: "520px" }}>
            <img
              src="/images/auth.jpg"
              alt="ThinkSpace Auth"
              style={{
                width: "100%",
                maxHeight: "560px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#1b2e35",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: { xs: 3, sm: 5, md: 6 },
          }}
        >
          <AlertBox />
          <Box sx={{ width: "100%", maxWidth: "440px", mx: "auto" }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{ color: "white", fontSize: "2.25rem", fontWeight: "bold" }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 1, mb: 3 }}>
              Sign in to manage your tasks, share posts, and browse textbooks.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                fullWidth
                placeholder="Enter Email"
                sx={{
                  mb: 1,
                  color: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "white",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff !important",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.7)",
                      opacity: 1,
                    },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #1b2e35 inset !important",
                    WebkitTextFillColor: "#ffffff !important",
                  },
                }}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "red", mb: 2 }}
                >
                  {errors.email.message}
                </Typography>
              )}
              <TextField
                fullWidth
                placeholder="Enter Password"
                type="password"
                sx={{
                  mb: 1,
                  color: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "white",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff !important",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.7)",
                      opacity: 1,
                    },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px #1b2e35 inset !important",
                    WebkitTextFillColor: "#ffffff !important",
                  },
                }}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <Typography variant="p" component="p" sx={{ color: "red" }}>
                  {errors.password.message}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                  sx={{ mt: 1, color: "gray" }}
                />
                <Link style={{ color: "white" }} to="/forgot-password">
                  <Typography variant="body2">Forgot Password</Typography>
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 4 }}
              >
                Log In
              </Button>
            </Box>
            <Divider sx={{ my: 1, color: "white" }}>OR</Divider>
            <Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
              >
                Continue With Google
              </Button>
            </Box>
            <Box>
              <Typography variant="body2" color="white" sx={{ mt: 4 }}>
                {`Don't`} Have an Account?
                <Link
                  to="/registration"
                  style={{ color: "white", marginLeft: "5px" }}
                >
                  Join Now
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
