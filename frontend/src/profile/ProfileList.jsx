import React from "react";
import { Avatar, Box, Typography, Paper, Grid, Link } from "@mui/material";
import rockerfellers from "../rockefellerFamily.json";

function ProfileCard({ person }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Avatar
        src={person.imgUrl}
        alt={person.name}
        sx={{
          width: 80,
          height: 80,
          border: "3px solid rgba(0, 0, 0, 0.46)",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {person.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Born: {person.dob || "Unknown"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Profession: {person.profession || "N/A"}
        </Typography>
        {/* You could add more summary fields here */}
      </Box>
    </Paper>
  );
}

function ProfilesList() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Family Members
      </Typography>

      <Grid container spacing={3}>
        {rockerfellers.map((person) => (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <ProfileCard person={person} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProfilesList;
