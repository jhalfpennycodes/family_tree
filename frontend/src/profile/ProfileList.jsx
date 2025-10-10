import React, { useState, useEffect } from "react";
import { Avatar, Box, Typography, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const LOCAL_SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL;

function ProfileBanner({ person }) {
  return (
    <Link to={`/profile/${person.id}`} style={{ textDecoration: "none" }}>
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
          src={person.avatar_img}
          alt={`${person.first_name} ${person.last_name}`}
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
            {`${person.first_name} ${person.last_name}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Born: {person.dob || "Unknown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profession: {person.profession || "N/A"}
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
}

function ProfilesList() {
  const [familyData, setFamilyData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getFamily = async () => {
      try {
        const response = await fetch(LOCAL_SERVER_URL + `family/2`);
        const json = await response.json();
        setFamilyData(json);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getFamily();
  }, []);
  if (loading) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress></CircularProgress>
      </Box>
    );
  }
  if (!familyData) return <div>Error loading data</div>;

  if (Array.isArray(familyData) && familyData.length > 0) {
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
          {familyData.map((person) => (
            <Grid key={person.id}>
              <ProfileBanner person={person} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}

export default ProfilesList;
