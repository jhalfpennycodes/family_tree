import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Fade from "@mui/material/Fade";

export default function InvalidToken() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  logout();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Fade in timeout={1000}>
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: "center",
            maxWidth: 420,
            borderRadius: 3,
          }}
        >
          <LoginIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Sign in to continue
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Seems like you're not authenticated, please sign in to view tree and
            family members.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/signin")}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Sign In
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}
