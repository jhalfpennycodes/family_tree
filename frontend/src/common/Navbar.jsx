import * as React from "react";
import { AppBar, Toolbar, Button, Avatar, Box, Stack } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ParkIcon from "@mui/icons-material/Park";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" startIcon={<AccountTreeIcon />} sx={{ mr: 2 }}>
          FreeFamilyTree
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Stack spacing={2} direction="row">
          <Link to="/tree">
            <Button variant="contained" startIcon={<ParkIcon />}>
              View Tree
            </Button>
          </Link>
          <Link to="/list">
            <Button variant="contained" startIcon={<FamilyRestroomIcon />}>
              Family Members
            </Button>
          </Link>
          <Link to="/addProfile">
            <Button variant="contained" startIcon={<PersonAddIcon />}>
              Add Person
            </Button>
          </Link>
          <Button
            color="inherit"
            startIcon={
              <Avatar alt="My Profile" sx={{ width: 24, height: 24 }} />
            }
            sx={{ textTransform: "none" }}
          >
            My Profile
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
