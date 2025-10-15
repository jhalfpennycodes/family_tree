import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import familyTreeGif from "../assets/family-tree.gif";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

export default function NoData() {
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
            p: 4,
            textAlign: "center",
            maxWidth: 420,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 👇 Contained image box */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <img
              src={familyTreeGif}
              alt="No data"
              style={{
                width: "100%",
                height: "auto", // ✅ preserve full image height
                objectFit: "contain",
                maxHeight: "250px", // optional safety limit
              }}
            />
          </Box>

          <Typography variant="h4" fontWeight={600} gutterBottom>
            No data here
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            No data was found here. Create your profile and build around it.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/addProfile")}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Create Profile
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}
