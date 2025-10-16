import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useAuth } from "../authentication/AuthProvider";
import ParkIcon from "@mui/icons-material/Park";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LinkIcon from "@mui/icons-material/Link";
import { IconButton } from "@mui/material";
import { Fade } from "@mui/material";

export default function Dashboard() {
  const { token } = useAuth();

  const cards = [
    {
      title: "View Tree",
      content: "Discover the layout of your family tree",
      link: "/tree",
      icon: <ParkIcon />,
    },
    {
      title: "Family Members",
      content: "A list of all your family members",
      link: "/listFamily",
      icon: <FamilyRestroomIcon />,
    },
    {
      title: "Add Family Member",
      content: "Create a new family member",
      link: "/addProfile",
      icon: <PersonAddIcon />,
    },
    {
      title: "Share Tree",
      content: "New feature coming soon",
      link: "/",
      icon: <LinkIcon />,
    },
  ];

  const publicCards = [
    {
      title: "View Famous Family Trees",
      content: "Discover the layout of your family tree",
      link: "/publicTree/0",
      icon: <ParkIcon />,
    },
    {
      title: "Family Members",
      content: "A list of all your family members",
      link: "/publicFamilies",
      icon: <FamilyRestroomIcon />,
    },
    {
      title: "Add Family Member",
      content: "Create a new family member",
      link: "/addProfile",
      icon: <PersonAddIcon />,
    },
    {
      title: "Share Tree",
      content: "New feature coming soon",
      link: "/",
      icon: <LinkIcon />,
    },
  ];

  const displayedCards = token ? cards : publicCards;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {displayedCards.map((card, index) => (
            <Link
              to={card.link}
              key={index}
              style={{ textDecoration: "none", height: "100%" }}
            >
              <Fade in timout={1000}>
                <Card
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    height: "100%", // ensures all cards stretch to same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    {/* Top row: title + icon */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 1,
                      }}
                    >
                      <Typography variant="h5">{card.title}</Typography>
                      <IconButton
                        size="small"
                        color="inherit"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Clicked ${card.title}`);
                        }}
                      >
                        {card.icon}
                      </IconButton>
                    </Box>

                    {/* Bottom row: content */}
                    <Typography variant="body2">{card.content}</Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
