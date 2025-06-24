import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  ImageList,
  ImageListItem,
  Button,
} from "@mui/material";
import rockerfellers from "../rockefellerFamily.json";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";

function ProfileField({ label, value, editable }) {
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

function ProfilePage(props) {
  const [editable, setEditable] = useState(false);
  const person = rockerfellers[0];

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
          src={person.imgUrl}
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
          {person.name}
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
            value={person.born || "1 Jan 1900"}
            editable={editable}
          />
          <ProfileSelectField
            label="Mother"
            value={person.parents[0]}
            editable={editable}
          />
          <ProfileField
            label="Father"
            value={person.parents[0] || "Richard Doe"}
            editable={editable}
          />
          <ProfileField
            label="Spouse(s)"
            value={person.siblings || "Mary Rockerfeller"}
            editable={editable}
          />
          <ProfileField
            label="Siblings"
            value={person.siblings || "Anna Doe, Mark Doe"}
            editable={editable}
          />
          <ProfileField
            label="Birth Location"
            value={person.birthLocation || "London, UK"}
            editable={editable}
          />
          <ProfileField
            label="Current location"
            value={person.birthLocation || "London, UK"}
            editable={editable}
          />
          <ProfileField
            label="Profession"
            value={person.birthLocation || "Philanthropist"}
            editable={editable}
          />
        </Box>
        {/* Dynamic wrapping photo album */}
        <ImageList
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
        >
          {rockerfellers.map((item) => (
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
        </ImageList>
        <LifeDescriptionSection
          value={person.lifeDescription}
          editable={editable}
        />
      </Box>
    </Box>
  );
}

export default ProfilePage;
