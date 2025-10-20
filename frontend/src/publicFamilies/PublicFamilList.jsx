import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

function ProfileBanner({ person }) {
  return (
    <Link to={`/publicProfile/${person.id}`} style={{ textDecoration: "none" }}>
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
  const [family, setFamily] = useState("");
  const navigate = useNavigate();
  const handleChange = (event) => {
    const selectedFamily = event.target.value;
    setFamily(selectedFamily);
    setSelectedFamily(selectedFamily); // pass family id up
    setLoading(true);

    const getFamily = async () => {
      try {
        const response = await fetch(
          VITE_API_BASE + `publicFamily/${selectedFamily}`
        );
        if (response.status == 500) {
          navigate("/serverError");
        }
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
          <MenuItem value={4}>The Beckhams</MenuItem>
          <MenuItem value={5}>The Jacksons</MenuItem>
          <MenuItem value={6}>The Jolie-Pitts</MenuItem>
          <MenuItem value={7}>The Smiths</MenuItem>
          <MenuItem value={8}>The Coppalas</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function ViewTree({ selectedFamily }) {
  return (
    <Link
      to={selectedFamily ? `/publicTree/${selectedFamily}` : "#"}
      style={{ pointerEvents: selectedFamily ? "auto" : "none", width: "100%" }}
    >
      <Button
        variant="contained"
        startIcon={<ParkIcon />}
        disabled={!selectedFamily}
        sx={{
          width: { xs: "100%", sm: "180px" }, // fixed width on desktop for alignment
          height: 56, // match typical Select height
        }}
      >
        View Tree
      </Button>
    </Link>
  );
}
export default function PublicFamilyList() {
  const [familyData, setFamilyData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFamily, setSelectedFamily] = React.useState("");

  return (
    <>
      {/* Responsive container for Select + Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "row" }, // row on mobile and desktop
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" }, // wrap on small mobile screens
          px: { xs: 2, sm: 5 },
          pt: { xs: 2, sm: 5 },
          mb: 3,
          gap: 1, // small gap between select and button
        }}
      >
        {/* Select Family */}
        <Box
          sx={{
            flex: { xs: "1 1 auto", sm: "0 0 60%" }, // flexible on mobile
            minWidth: 0, // allows shrinking on small screens
          }}
        >
          <SelectFamily
            setFamilyData={setFamilyData}
            setLoading={setLoading}
            setSelectedFamily={setSelectedFamily}
          />
        </Box>

        {/* View Tree Button */}
        <Box
          sx={{
            flex: { xs: "0 0 auto", sm: "0 0 auto" },
          }}
        >
          <ViewTree selectedFamily={selectedFamily} />
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 3,
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
          Family Members
        </Typography>
      </Box>
      <ProfilesList familyData={familyData} loading={loading} />
    </>
  );
}
