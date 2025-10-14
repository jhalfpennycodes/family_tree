import * as React from "react";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Stack,
  Menu,
} from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ParkIcon from "@mui/icons-material/Park";
import PublicTree from "./PublicTree";
import { useParams } from "react-router-dom";

function SelectFamily({ selectedFamily, setSelectedFamily }) {
  const handleChange = (event) => {
    const selectedFamily = event.target.value;
    setSelectedFamily(selectedFamily); // pass family id up
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select family</InputLabel>
        <Select
          labelId="family-select-label"
          id="family-select"
          label="Famous family"
          value={selectedFamily ?? ""}
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
      to={selectedFamily ? `/publicTree/${selectedFamily}` : "#"}
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

export default function PublicFamilyTree() {
  const [selectedFamily, setSelectedFamily] = useState("");
  const { familyId } = useParams(); // Read the URL parameter

  return (
    <>
      <Stack spacing={1} direction="row">
        <Box sx={{ padding: "30px", paddingBottom: "5px", width: "30%" }}>
          <SelectFamily
            selectedFamily={selectedFamily}
            setSelectedFamily={setSelectedFamily}
          />
        </Box>
        <Box
          sx={{
            padding: "50px",
            paddingTop: "40px",
            paddingLeft: "0px",
            paddingBottom: "30px",
            width: "30%",
          }}
        >
          <ViewTree selectedFamily={selectedFamily} />
        </Box>
      </Stack>
      {familyId != 0 && <PublicTree key={familyId} />}
    </>
  );
}
