import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

export default function ServerError() {
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
          <ErrorIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Server Issue
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Oops, it seems like the server is down for now, please try again
            later
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}
