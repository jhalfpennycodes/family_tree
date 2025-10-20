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

const menuItems = [
  {
    value: 1,
    title: "The Rockerfellers",
  },
  {
    value: 2,
    title: "The Royal Family",
  },
  {
    value: 3,
    title: "The Kardashians",
  },
  {
    value: 4,
    title: "The Beckhams",
  },
  {
    value: 5,
    title: "The Jacksons",
  },
  {
    value: 6,
    title: "The Jolie-Pitts",
  },
  {
    value: 7,
    title: "The Smiths",
  },
  {
    value: 8,
    title: "The Coppalas",
  },
];

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
          {menuItems.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              component={Link}
              to={`/publicTree/${item.value}`}
            >
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
export default function PublicFamilyTree() {
  const [selectedFamily, setSelectedFamily] = useState("");
  const { familyId } = useParams(); // Read the URL parameter

  return (
    <>
      {/* Responsive container for SelectFamily */}
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "flex-start" }}
        sx={{ px: { xs: 2, sm: 5 }, pt: { xs: 2, sm: 5 }, mb: 3 }}
      >
        {/* Select Family */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "0 0 55%" }, // slightly longer on desktop
            minWidth: 150,
          }}
        >
          <SelectFamily
            selectedFamily={selectedFamily}
            setSelectedFamily={setSelectedFamily}
          />
        </Box>

        {/* Empty spacer to maintain layout alignment on desktop */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "0 0 30%" }, // optional, keeps spacing consistent
          }}
        />
      </Stack>

      {/* Render tree if a family is selected */}
      {familyId != 0 && <PublicTree key={familyId} />}
    </>
  );
}
