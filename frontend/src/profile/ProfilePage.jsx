import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthProvider";

import {
  Avatar,
  Box,
  Typography,
  TextField,
  ImageList,
  ImageListItem,
  Button,
  Stack,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

function BornField({ label, profileData }) {
  return (
    <Box
      sx={{
        mb: 2,
        pl: 3,
        borderLeft: "4px solid #ccc",
        backgroundColor: "#f9f9f9",
        borderRadius: 1,
        py: 1,
      }}
    >
      <Typography variant="subtitle" color="text.secondary" mb={2}>
        {label}
      </Typography>
      <Typography variant="body1">{profileData}</Typography>
    </Box>
  );
}

function ProfileTextField({ label, value }) {
  return (
    <Box
      sx={{
        mb: 2,
        pl: 3,
        borderLeft: "4px solid #ccc",
        backgroundColor: "#f9f9f9",
        borderRadius: 1,
        py: 1,
      }}
    >
      <Typography variant="subtitle" color="text.secondary" mb={2}>
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

function ProfileSelectField({ label, profileData, field }) {
  if (!profileData[field].id) {
    return (
      <Box
        sx={{
          mb: 2,
          pl: 3,
          borderLeft: "4px solid #ccc",
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
          py: 1,
        }}
      >
        <Typography variant="subtitle" color="text.secondary" mb={2}>
          {label}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography>Unknown</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mb: 2,
        pl: 3,
        borderLeft: "4px solid #ccc",
        backgroundColor: "#f9f9f9",
        borderRadius: 1,
        py: 1,
      }}
    >
      <Typography variant="subtitle" color="text.secondary" mb={2}>
        {label}
      </Typography>

      <Link
        to={`/profile/${profileData[field].id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={profileData[field].avatar_img}
            alt="Profile"
            sx={{
              width: 50,
              height: 50,
              border: "4px solid rgba(0, 0, 0, 0.46)",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: 1,
              cursor: "pointer",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: 8,
              },
            }}
          />
          <Typography>
            {profileData[field].first_name} {profileData[field].last_name}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}

function ProfileMultiSelectField({ label, inputData, field }) {
  return (
    <Box
      sx={{
        mb: 2,
        pl: 3,
        borderLeft: "4px solid #ccc",
        backgroundColor: "#f9f9f9",
        borderRadius: 1,
        py: 1,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
        {inputData[field].map((person, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <Box sx={{ width: 200 }}>
              <Link
                to={`/profile/${person.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={person.avatar_img}
                    alt="Profile"
                    sx={{
                      width: 50,
                      height: 50,
                      border: "4px solid rgba(0, 0, 0, 0.46)",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: 1,
                      cursor: "pointer",
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: 8,
                      },
                    }}
                  />
                  <Typography>
                    {person.first_name} {person.last_name}
                  </Typography>
                </Box>
              </Link>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function LifeDescriptionSection({ value, editable }) {
  const sections = [
    {
      title: "Early Life",
      text: value[0]?.early_life || "Details about early childhood...",
    },
    {
      title: "Young Adult",
      text: value[0]?.young_adult || "College, first job, etc...",
    },
    {
      title: "Adult",
      text: value[0]?.adult_life || "Family, career progression...",
    },
    {
      title: "Later Life",
      text: value[0]?.late_life || "Retirement, contributions, etc...",
    },
  ];

  return (
    <Box mb={2} sx={{ width: "100%" }}>
      <h2>Life Description</h2>
      {sections.map((section, idx) => (
        <Box
          key={idx}
          sx={{
            mb: 2,
            pl: 3,
            borderLeft: "4px solid #ccc",
            backgroundColor: "#f9f9f9",
            borderRadius: 1,
            py: 1,
          }}
        >
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ mb: 1, color: "text.primary" }}
          >
            {section.title}
          </Typography>
          {editable ? (
            <TextField
              fullWidth
              defaultValue={section.text}
              variant="outlined"
              size="small"
              multiline
              minRows={3}
            />
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {section.text}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

function ProfilePageLayout({ profileData }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const deleteProfile = async () => {
    try {
      const response = await fetch(
        VITE_API_BASE + `profile/${profileData.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 202) {
        navigate("/listFamily");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
        position: "relative",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      {/* Avatar and Name on top */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar
          src={profileData.avatar_img}
          alt="Profile"
          sx={{
            width: 150,
            height: 150,
            border: "4px solid rgba(0, 0, 0, 0.46)",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {profileData.first_name} {profileData.last_name}
        </Typography>
        <Box sx={{ position: "absolute", top: 80, right: 50 }}>
          <Fab color="primary">
            <DeleteIcon onClick={handleClickOpen} />
          </Fab>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="dialog-title">{"Delete Profile?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this profile? Once the data is
              deleted it can not longer be retrieved.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={deleteProfile} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <h2>General Inforamtion</h2>

      {/* Profile info + photo album */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Profile fields with spacing (left) */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <BornField
            label="Born"
            profileData={profileData.dob ? profileData.dob : "Unable to load"}
          />
          <ProfileSelectField
            label="Mother"
            profileData={profileData ? profileData : "Unknown"}
            field="mother"
          />
          <ProfileSelectField
            label="Father"
            profileData={profileData ? profileData : "Unknown"}
            field="father"
          />
          <ProfileMultiSelectField
            label="Spouse(s)"
            inputData={profileData}
            field="spouses"
          ></ProfileMultiSelectField>
          <ProfileMultiSelectField
            label="Children"
            inputData={profileData}
            field="children"
          ></ProfileMultiSelectField>

          <ProfileTextField
            label="Birth Location"
            value={profileData.birth_location || "Unknown"}
          />
          <ProfileTextField
            label="Profession"
            value={profileData.profession || "Unknown"}
          />
        </Box>
        <LifeDescriptionSection value={profileData.life_description} />
      </Box>
    </Box>
  );
}

function ProfilePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(VITE_API_BASE + `profile/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status == 401 || response.status == 403) {
          const e = await response.json();
          if (e.error == "token_expired") {
            navigate("/sessionExpired");
            return;
          }
          navigate("/forbidden");
          return;
        }
        const json = await response.json();
        setProfileData(json);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [id]);

  if (loading) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full viewport height
          width: "100vw", // full viewport width (optional)
        }}
      >
        <CircularProgress></CircularProgress>
      </Box>
    );
  }
  if (!profileData) return <div>Error loading profile</div>;
  return <ProfilePageLayout profileData={profileData[0]} />;
}

export default ProfilePage;
