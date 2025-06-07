import * as React from "react";
import { AppBar, Toolbar, Button, Avatar, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" startIcon={<HomeIcon />} sx={{ mr: 2 }}>
          Home
        </Button>

        {/* Push right content to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right side buttons */}
        <Link to="/tree">
          <Button color="inherit">Family Tree</Button>
        </Link>
        <Link to="/list">
          <Button color="inherit">Family Members</Button>
        </Link>

        <Button
          color="inherit"
          startIcon={<Avatar alt="My Profile" sx={{ width: 24, height: 24 }} />}
          sx={{ textTransform: "none" }}
        >
          My Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
}
