import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

export default function SessionExpired() {
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
          <AccessAlarmsIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Session Expired
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Your session expired. Please sign in again to access your family
            data.
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
