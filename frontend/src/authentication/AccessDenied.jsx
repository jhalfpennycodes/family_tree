import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

export default function AccessDenied() {
  const navigate = useNavigate();

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
          <LockOutlinedIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            You don’t have permission to view this page. Please contact your
            administrator or go back to a safe page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/")}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Go Home
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}
