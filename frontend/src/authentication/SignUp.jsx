import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import {
  Alert,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import Fade from "@mui/material/Fade";

const LOCAL_SIGNUP_URL = import.meta.env.VITE_LOCAL_SIGNUP_URL;

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.password
    ) {
      if (formData.password !== formData.confirm_password) {
        setError("Password do not match.");
      } else {
        try {
          const response = await fetch(LOCAL_SIGNUP_URL, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          if (response.status === 200) {
            const data = await response.json();
            if (data.access_token) {
              console.log("This came from the backend", data.access_token);
              login(data.access_token);
              navigate("/listFamily");
              return;
            }
          } else if (response.status === 400) {
            const errorData = await response.json();
            if (errorData.message === "Email already registered.") {
              setError(
                "Email already registered, please sign in or use another email."
              );
              return;
            } else {
              navigate("/serverError");
              return;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      setError("Please fill out all fields");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Fade in timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Sign up
            </Typography>
            <form
              noValidate
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                alignItems: "center",
              }}
              onSubmit={handleSubmit}
            >
              <TextField
                required
                label="First Name"
                name="firstName"
                sx={{ width: "80%" }}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
              <TextField
                required
                label="Last Name"
                name="lastName"
                sx={{ width: "80%" }}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
              <TextField
                required
                label="Email Address"
                name="email"
                sx={{ width: "80%" }}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <TextField
                required
                label="Password"
                type="password"
                name="password"
                sx={{ width: "80%" }}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <TextField
                required
                label="Confirm password"
                type="password"
                name="confirm password"
                sx={{ width: "80%" }}
                onChange={(e) =>
                  handleChange("confirm_password", e.target.value)
                }
              />
              <Button
                required
                type="submit"
                variant="contained"
                sx={{ width: "80%", mt: 1 }}
              >
                Sign Up
              </Button>
              {error && (
                <Alert variant="filled" severity="error">
                  {error}
                </Alert>
              )}
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
