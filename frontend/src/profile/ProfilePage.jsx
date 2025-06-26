import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  ImageList,
  ImageListItem,
  Button,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

function ProfileField({ label, value, editable, id }) {
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
      {editable ? (
        <TextField
          fullWidth
          defaultValue={value}
          variant="outlined"
          size="small"
        />
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Box>
  );
}

function ProfileSelectField({ label, value, editable }) {
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
      {editable ? (
        <select name="selectMother">
          {rockerfellers.map((rockerfeller) => (
            <option key={rockerfeller.id}>{rockerfeller.name} </option>
          ))}
        </select>
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Box>
  );
}

function LifeDescriptionSection({ value, editable }) {
  const sections = [
    {
      title: "Early Life",
      text: value?.earlyLife || "Details about early childhood...",
    },
    {
      title: "Teenage Years",
      text: value?.teenageYears || "Events from teenage years...",
    },
    {
      title: "Young Adult",
      text: value?.youngAdult || "College, first job, etc...",
    },
    {
      title: "Adult",
      text: value?.adult || "Family, career progression...",
    },
    {
      title: "Later Life",
      text: value?.laterLife || "Retirement, contributions, etc...",
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

function ProfilePage({ profileData }) {
  if (!profileData) {
    return <div>No Data</div>;
  }
  console.log("Data entering component ", profileData);
  console.log("Name", profileData.first_name);
  const [editable, setEditable] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        {editable ? (
          <Button
            onClick={() => {
              setEditable(!editable);
            }}
            sx={{
              position: "absolute",
              top: 80,
              right: 0,
              boxShadow: 2,
            }}
          >
            Done
          </Button>
        ) : (
          <IconButton
            aria-label="more options"
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            size="large"
            sx={{
              position: "absolute",
              top: 80,
              right: 0,
              borderRadius: "50%",
              boxShadow: 2,
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        )}

        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose}>
            <EditIcon
              onClick={() => {
                setEditable(!editable);
              }}
            />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link>
              <DeleteIcon />
            </Link>
          </MenuItem>
        </Menu>
      </Box>

      <h2>General Inforamtion</h2>

      {/* Profile info + photo album */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Profile fields with spacing (left) */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <ProfileField
            label="Born"
            value={profileData.dob ? profileData.dob : "Unable to load"}
            editable={editable}
          />
          <ProfileSelectField
            label="Mother"
            value={profileData.mother ? profileData.mother : "Unknown"}
            editable={editable}
          />
          <ProfileField
            label="Father"
            value={profileData.father ? profileData.father : "Unknown"}
            editable={editable}
          />

          {profileData.spouses && profileData.spouses.length > 0 ? (
            profileData.spouses.map((spouse) => (
              <ProfileField
                label="Spouse(s)"
                value={`${spouse.first_name} ${spouse.last_name}`}
                editable={editable}
              />
            ))
          ) : (
            <ProfileField
              label="Spouse(s)"
              value="No known spouses"
              editable={editable}
            />
          )}
          {profileData.children && profileData.children.length > 0 ? (
            profileData.children.map((index, child) => (
              <ProfileField
                key={index}
                label="Children"
                value={`${child.first_name} ${child.last_name}`}
                editable={editable}
              />
            ))
          ) : (
            <ProfileField
              label="Spouse(s)"
              value="No known chidlren"
              editable={editable}
            />
          )}
          {/* <ProfileField
            label="Spouse(s)"
            value={profileData.siblings || "Mary Rockerfeller"}
            editable={editable}
          />
          <ProfileField
            label="Siblings"
            value={profileData.siblings[0] || "Anna Doe, Mark Doe"}
            editable={editable}
          /> */}
          <ProfileField
            label="Birth Location"
            value={profileData.birth_location || "London, UK"}
            editable={editable}
          />
          <ProfileField
            label="Profession"
            value={profileData.profession || "Philanthropist"}
            editable={editable}
          />
        </Box>
        {/* Dynamic wrapping photo album */}
        {/* <ImageList
          cols={2}
          gap={4}
          sx={{
            borderRadius: 1,
            boxShadow: 5,
            bgcolor: "background.paper",
            maxWidth: 500,
            maxHeight: 550,
            width: "100%",
          }}
        > */}
        {/* {rockerfellers.map((item) => (
            <ImageListItem key={item.id} sx={{ borderRadius: 3, boxShadow: 3 }}>
              <img
                src={item.imgUrl}
                alt={item.name}
                loading="lazy"
                width={"100%"}
                height={"auto"}
              />
            </ImageListItem>
          ))}
        </ImageList> */}
        <LifeDescriptionSection
          value={profileData.lifeDescription}
          editable={editable}
        />
      </Box>
    </Box>
  );
}

function ProfileLogic() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/familyTree/profile/${id}`
        );
        const json = await response.json();
        console.log("Initial data: ", json);
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
  console.log("Profile Data: ", profileData);
  return <ProfilePage profileData={profileData[0]} />;
}

export default ProfileLogic;
