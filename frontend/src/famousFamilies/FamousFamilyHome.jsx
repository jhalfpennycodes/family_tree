import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ParkIcon from "@mui/icons-material/Park";

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

function ProfilesList({ familyData, loading }) {
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
        <CircularProgress />
      </Box>
    );
  }

  if (!familyData) return <div>Error loading data</div>;

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
        {Array.isArray(familyData) &&
          familyData.map((person) => (
            <Grid key={person.id}>
              <ProfileBanner person={person} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

function SelectFamily({ setFamilyData, setLoading, setSelectedFamily }) {
  const [family, setFamily] = React.useState("");

  const handleChange = (event) => {
    const selectedFamily = event.target.value;
    setFamily(selectedFamily);
    setSelectedFamily(selectedFamily); // pass family id up
    setLoading(true);

    const getFamily = async () => {
      try {
        const response = await fetch(
          LOCAL_SERVER_URL + `family/${selectedFamily}`
        );
        const json = await response.json();
        setFamilyData(json);
      } catch (error) {
        console.error("API Error:", error);
        setFamilyData(null);
      } finally {
        setLoading(false);
      }
    };

    getFamily();
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select family</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={family}
          label="Famous family"
          onChange={handleChange}
        >
          <MenuItem value={1}>The Rockerfellers</MenuItem>
          <MenuItem value={2}>The Royal Family</MenuItem>
          <MenuItem value={3}>The Kardashians</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function ViewTree({ selectedFamily }) {
  return (
    <Link
      to={selectedFamily ? `/tree/${selectedFamily}` : "#"}
      style={{ pointerEvents: selectedFamily ? "auto" : "none" }}
    >
      <Button
        variant="contained"
        startIcon={<ParkIcon />}
        disabled={!selectedFamily}
      >
        View Tree
      </Button>
    </Link>
  );
}

export default function FamousFamilyHome() {
  const [familyData, setFamilyData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFamily, setSelectedFamily] = React.useState("");

  return (
    <>
      <Stack spacing={1} direction="row">
        <Box sx={{ padding: "50px", paddingBottom: "20px", width: "30%" }}>
          <SelectFamily
            setFamilyData={setFamilyData}
            setLoading={setLoading}
            setSelectedFamily={setSelectedFamily}
          />
        </Box>
        <Box
          sx={{
            padding: "50px",
            paddingTop: "60px",
            paddingLeft: "0px",
            width: "30%",
          }}
        >
          <ViewTree selectedFamily={selectedFamily} />
        </Box>
      </Stack>
      <ProfilesList familyData={familyData} loading={loading} />
    </>
  );
}
