import * as React from "react";
import { AppBar, Toolbar, Button, Avatar, Box, Stack } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ParkIcon from "@mui/icons-material/Park";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../authentication/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <Button
            startIcon={<AccountTreeIcon />}
            sx={{ mr: 2, color: "white" }}
          >
            FreeFamilyTree
          </Button>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Stack spacing={2} direction="row">
          {!token ? (
            <div>
              <Stack spacing={2} direction="row">
                <Link to="/tree">
                  <Button variant="contained" startIcon={<ParkIcon />}>
                    View Tree
                  </Button>
                </Link>
                <Link to="/famous">
                  <Button
                    variant="contained"
                    startIcon={<FamilyRestroomIcon />}
                  >
                    Famous Families
                  </Button>
                </Link>
              </Stack>
            </div>
          ) : (
            <div>
              <Link to="/tree">
                <Button variant="contained" startIcon={<ParkIcon />}>
                  View My Tree
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
            </div>
          )}
          {!token ? (
            <Link to="/signin">
              <Button variant="contained" startIcon={<LoginIcon></LoginIcon>}>
                Sign in
              </Button>
            </Link>
          ) : (
            <Link onClick={handleLogout}>
              <Button variant="contained" startIcon={<LogoutIcon />}>
                Sign out
              </Button>
            </Link>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
