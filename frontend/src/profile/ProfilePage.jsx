import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

const LOCAL_SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL;

function BornField({ label, profileData, editable }) {
  if (!editable)
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

function ProfileTextField({ label, value, editable }) {
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

function ProfileSelectField({
  label,
  profileData,
  editable,
  inputData,
  field,
}) {
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
        {editable ? (
          <select name="selectMother">
            {inputData.map((person) => (
              <option key={person.id}>
                {person.first_name} {person.last_name}
              </option>
            ))}
          </select>
        ) : (
          <Box display="flex" alignItems="center">
            <Typography>Unknown</Typography>
          </Box>
        )}
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
      {editable ? (
        <select name="selectMother">
          {inputData.map((person) => (
            <option key={person.id}>
              {person.first_name} {person.last_name}
            </option>
          ))}
        </select>
      ) : (
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
              }}
            />
            <Typography>
              {profileData[field].first_name} {profileData[field].last_name}
            </Typography>
          </Box>
        </Link>
      )}
    </Box>
  );
}

function ProfileMultiSelectField({
  label,
  onChange,
  onDelete,
  formData,
  inputData,
  boxLabel,
  field,
  editable,
}) {
  const addSpouse = (e) => {
    onChange(e.target.value, formData[field].length);
  };

  const removeSpouse = (index) => {
    onDelete(index);
  };

  const handleChange = (e, index) => {
    const id = e.target.value;
    onChange(id, index);
  };

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
      {editable ? (
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
          {formData[field].map((p, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Box sx={{ width: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id={`select-label-${index}`}>
                    {boxLabel}
                  </InputLabel>
                  <Select
                    labelId={`select-label-${index}`}
                    name={label}
                    onChange={(e) => handleChange(e, index)}
                    id={`select-${index}`}
                    value={p || 0}
                    displayEmpty
                  >
                    <MenuItem value={0} key={0}>
                      None
                    </MenuItem>
                    {inputData.map((person, personIndex) => (
                      <MenuItem key={personIndex} value={person.id}>
                        {person.first_name} {person.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <HighlightOffOutlinedIcon
                sx={{ cursor: "pointer", color: "error.main", ml: 1 }}
                onClick={() => removeSpouse(index)}
              />
            </Box>
          ))}
          <AddCircleIcon sx={{ cursor: "pointer" }} onClick={addSpouse} />
        </Stack>
      ) : (
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
                        marginRight: 1, // adds space between avatar and text
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [familyData, setFamilyData] = useState();

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
            inputData={familyData}
            field="mother"
          />
          <ProfileSelectField
            label="Father"
            profileData={profileData ? profileData : "Unknown"}
            inputData={familyData}
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
            value={profileData.birth_location || "London, UK"}
          />
          <ProfileTextField
            label="Profession"
            value={profileData.profession || "Philanthropist"}
          />
        </Box>
        <LifeDescriptionSection value={profileData.lifeDescription} />
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
        const response = await fetch(LOCAL_SERVER_URL + `profile/${id}`);
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
  return <ProfilePage profileData={profileData[0]} />;
}

export default ProfileLogic;
