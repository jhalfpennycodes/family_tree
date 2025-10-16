import * as React from "react";
import { useState } from "react";
import { AppBar, Toolbar, Button, Avatar, Box, Stack } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ParkIcon from "@mui/icons-material/Park";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IconButton } from "@mui/material";

import { useAuth } from "../authentication/AuthProvider";
import { useTheme, useMediaQuery } from "@mui/material";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // small screens
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { token, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return isMobile ? (
    <AppBar position="static">
      <Toolbar>
        {/* Logo always visible */}
        <Link to="/">
          <Button startIcon={<AccountTreeIcon />} sx={{ color: "white" }}>
            FreeFamilyTree
          </Button>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {/* Hamburger menu for mobile */}
        {isMobile && (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <List sx={{ width: 250 }}>
                {(!token
                  ? [
                      {
                        text: "View Tree",
                        link: "/publicTree/0",
                        icon: <ParkIcon />,
                      },
                      {
                        text: "Famous Families",
                        link: "/publicFamilies",
                        icon: <FamilyRestroomIcon />,
                      },
                      { text: "Sign in", link: "/signin", icon: <LoginIcon /> },
                    ]
                  : [
                      {
                        text: "View My Tree",
                        link: "/tree",
                        icon: <ParkIcon />,
                      },
                      {
                        text: "Family Members",
                        link: "/listFamily",
                        icon: <FamilyRestroomIcon />,
                      },
                      {
                        text: "Add Person",
                        link: "/addProfile",
                        icon: <PersonAddIcon />,
                      },
                      {
                        text: "Sign out",
                        link: "/",
                        icon: <LogoutIcon />,
                        onClick: handleLogout,
                      },
                    ]
                ).map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.link}
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        setDrawerOpen(false); // close drawer
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  ) : (
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
                <Link to="/publicTree/0">
                  <Button variant="contained" startIcon={<ParkIcon />}>
                    View Tree
                  </Button>
                </Link>
                <Link to="/publicFamilies">
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
              <Stack spacing={2} direction="row">
                <Link to="/tree">
                  <Button variant="contained" startIcon={<ParkIcon />}>
                    View My Tree
                  </Button>
                </Link>
                <Link to="/listFamily">
                  <Button
                    variant="contained"
                    startIcon={<FamilyRestroomIcon />}
                  >
                    Family Members
                  </Button>
                </Link>
                <Link to="/addProfile">
                  <Button variant="contained" startIcon={<PersonAddIcon />}>
                    Add Person
                  </Button>
                </Link>
              </Stack>
            </div>
          )}
          {!token ? (
            <Link to="/signin">
              <Button variant="contained" startIcon={<LoginIcon></LoginIcon>}>
                Sign in
              </Button>
            </Link>
          ) : (
            <Link onClick={handleLogout} to="/">
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
