import {
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
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const LOCAL_SIGNIN_URL = import.meta.env.VITE_LOCAL_SIGNIN_URL;

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        const response = await fetch(LOCAL_SIGNIN_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.access_token) {
          console.log("This came from the backend", data.access_token);
          login(data.access_token);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Enter email and password");
      setError("Please enter both email and password.");
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
            Sign In
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
              label="Email Address"
              name="email"
              sx={{ width: "80%" }}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              sx={{ width: "80%" }}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button
              required
              type="submit"
              variant="contained"
              sx={{ width: "80%", mt: 1 }}
            >
              Sign In
            </Button>
            <Link href="/signup" variant="body2">
              Don't have an account? Sign up
            </Link>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
