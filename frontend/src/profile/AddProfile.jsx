import React, { useState, useEffect } from "react";
import { useAuth } from "../authentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Fab,
  Typography,
  TextField,
  Select,
  InputLabel,
  Button,
  Stack,
  Paper,
  Fade,
  IconButton,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ImageUploading from "react-images-uploading";

function InputField({ value, onChange, label, boxLabel }) {
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
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ display: "block", mb: 1 }}
      >
        <label>{label}</label>
      </Typography>
      <TextField
        onChange={(e) => onChange(e.target.value)}
        value={value}
        id="outlined-basic"
        label={boxLabel}
        variant="outlined"
      />
    </Box>
  );
}

function RequiredInputField({ value, onChange, label, boxLabel }) {
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
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ display: "block", mb: 1 }}
      >
        <label>{label}</label>
      </Typography>
      <TextField
        onChange={(e) => onChange(e.target.value)}
        value={value}
        id="outlined-basic"
        label={boxLabel}
        variant="outlined"
        required
      />
    </Box>
  );
}

function DateField({ value, onChange }) {
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
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ display: "block", mb: 1 }}
      >
        <label>Date of Birth</label>
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            sx={{ width: "25%" }}
            isRequired
            format="YYYY-MM-DD"
            label="Born"
            value={value}
            onChange={(newValue) => onChange(newValue)}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}

function LifeDescriptionField({ title, label, onChange, value }) {
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
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ mb: 1, color: "text.primary" }}
      >
        {title}
      </Typography>
      <TextField
        onChange={(e) => onChange(e.target.value)}
        value={value}
        fullWidth
        multiline
        id="outlined-basic"
        variant="outlined"
        label={label}
      />
    </Box>
  );
}

export function SelectField({ label, onChange, inputValue, boxLabel }) {
  const [selectedId, setSelectedId] = useState("");

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    onChange(id);
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
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        {label}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="select-label">{boxLabel}</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          name={label}
          value={selectedId}
          onChange={handleChange}
          sx={{ width: "25%", mt: 1 }}
          displayEmpty
        >
          <MenuItem value={0} key={0}>
            Unknown
          </MenuItem>
          {inputValue.map((person, index) => (
            <MenuItem key={index} value={person.id}>
              {person.first_name} {person.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function MultiSelectField({
  label,
  onChange,
  onDelete,
  formData,
  inputData,
  boxLabel,
  field,
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
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: "wrap", alignItems: "flex-start" }}
      >
        {formData[field].map((p, index) => (
          <Fade in timeout={1000} key={index}>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id={`select-label-${index}`}>{boxLabel}</InputLabel>
                <Select
                  labelId={`select-label-${index}`}
                  name={label}
                  onChange={(e) => handleChange(e, index)}
                  id={`select-${index}`}
                  value={p || 0}
                  displayEmpty
                  label={boxLabel}
                >
                  <MenuItem value={0}>None</MenuItem>
                  {inputData.map((person, personIndex) => (
                    <MenuItem key={personIndex} value={person.id}>
                      {person.first_name} {person.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                size="small"
                color="error"
                onClick={() => removeSpouse(index)}
                sx={{
                  mt: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <HighlightOffOutlinedIcon />
              </IconButton>
            </Box>
          </Fade>
        ))}

        <Fab
          size="small"
          color="primary"
          onClick={addSpouse}
          aria-label="add"
          sx={{ mt: 1 }}
        >
          <AddCircleIcon />
        </Fab>
      </Stack>
    </Box>
  );
}

function GenderSelectField({ label, value, onChange, boxLabel }) {
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
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        {label}
      </Typography>

      <FormControl fullWidth>
        <InputLabel>{boxLabel}</InputLabel>
        <Select
          sx={{ width: "25%", mt: 1 }}
          fullWidth
          name={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem key={0} value={"Male"}>
            Male
          </MenuItem>
          <MenuItem key={1} value={"Female"}>
            Female
          </MenuItem>
          <MenuItem key={2} value={"Other"}>
            Other
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function ImageField({ onChange }) {
  const [images, setImages] = useState();
  const maxNumber = 1;
  const [avatarImg, setAvatarImg] = useState(
    "https://cdn-icons-png.freepik.com/256/8467/8467062.png?semt=ais_hybrid"
  );
  const [imageChange, setImageChange] = useState(false);

  // renamed to avoid clashing with prop
  const handleImageChange = (imageList) => {
    if (imageList && imageList.length > 0) {
      const imageDataUrl = imageList[0]["data_url"];
      setAvatarImg(imageDataUrl);
      // send raw data (or whole imageList[0] if needed) to parent
      onChange("avatar_img", imageList[0]["data_url"]);
      setImageChange(true);
    } else {
      const defaultAvatar =
        "https://cdn-icons-png.freepik.com/256/8467/8467062.png?semt=ais_hybrid";
      setAvatarImg(defaultAvatar);
      onChange("avatar_img", defaultAvatar); // or null
      setImageChange(false);
    }

    setImages(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={handleImageChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <Avatar
              src={avatarImg}
              alt="Add avatar image"
              sx={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 1,
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 8,
                },
              }}
              elevation={3}
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            />
            {imageChange && (
              <Button
                variant="outlined"
                onClick={onImageRemoveAll}
                sx={{ marginTop: 2 }}
              >
                Remove Image
              </Button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

function AddProfileForm(props) {
  const VITE_API_BASE = import.meta.env.VITE_API_BASE;
  const [familyData, setFamilyData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    const getFamily = async () => {
      try {
        const response = await fetch(VITE_API_BASE + `listFamily`, {
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
        setFamilyData(json);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getFamily();
  }, []);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: null,
    mother_id: "",
    father_id: "",
    spouses: [],
    children: [],
    birth_location: "",
    profession: "",
    early_life_description: "",
    young_adult_description: "",
    adult_life_description: "",
    late_life_description: "",
    avatar_img: null,
    images: [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteArrayValue = (field, deleteIndex) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, index) => index !== deleteIndex),
    }));
  };

  const handleArrayChange = (field, value, index) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value; // Replace the value at the specific index
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gender) {
      setError("Please select a gender");
    }
    if (!formData.dob) {
      setError("Please select a date of birth");
    }
    if (
      formData.first_name &&
      formData.last_name &&
      formData.gender &&
      formData.dob
    ) {
      const response = await fetch(VITE_API_BASE + "profileAdd", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.status == 201) {
        navigate("/listFamily");
      } else if (response.status == 400) {
        const e = await response.json();
        setError(e);
      }
    }
  };

  if (!loading && (!familyData || familyData.length === 0)) {
    return (
      <div>
        <form name="profileForm" onSubmit={handleSubmit}>
          <Box
            sx={{
              maxWidth: 1200,
              mx: "auto",
              p: 3,
              position: "relative",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              Create Profile
            </Typography>
            <ImageField onChange={handleChange}></ImageField>
            <h2>General Information</h2>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <RequiredInputField
                name="firstName"
                label="First Name"
                boxLabel="Enter first name"
                value={formData.first_name}
                onChange={(val) => handleChange("first_name", val)}
              />
              <RequiredInputField
                label="Last Name"
                boxLabel="Enter last name"
                value={formData.last_name}
                onChange={(val) => handleChange("last_name", val)}
              />
              <GenderSelectField
                name="gender"
                label="Gender"
                boxLabel="Select gender"
                value={formData.gender}
                onChange={(val) => handleChange("gender", val)}
              ></GenderSelectField>
              <DateField
                label="Born"
                value={formData.dob}
                onChange={(val) => handleChange("dob", val)}
              />
              <InputField
                label="Birth Location"
                boxLabel="Enter birth location"
                value={formData.birth_location}
                onChange={(val) => handleChange("birth_location", val)}
              />
              <InputField
                label="Profession"
                boxLabel="Enter profession"
                value={formData.profession}
                onChange={(val) => handleChange("profession", val)}
              />
            </Box>
            <Box mb={2} sx={{ width: "100%" }}>
              <h2>Life Description</h2>
            </Box>
            <LifeDescriptionField
              title="Early Life"
              label="Write about the early life of this person..."
              value={formData.early_life_description}
              onChange={(val) => handleChange("early_life_description", val)}
            />
            <LifeDescriptionField
              title="Young Adult Life"
              label="Write about the teenage years of this person..."
              value={formData.young_adult_description}
              onChange={(val) => handleChange("young_adult_description", val)}
            />
            <LifeDescriptionField
              title="Adult Life"
              label="Write about the adult life of this person..."
              value={formData.adult_life_description}
              onChange={(val) => handleChange("adult_life_description", val)}
            />
            <LifeDescriptionField
              title="Late Life"
              label="Write about the later year of life of this person..."
              value={formData.late_life_description}
              onChange={(val) => handleChange("late_life_description", val)}
            />
          </Box>
          <Box
            sx={{
              py: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button size="large" variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // full viewport height
              width: "100vw", // full viewport width (optional)
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
              }}
            >
              <CircularProgress></CircularProgress>
            </Box>
          </div>
        ) : (
          <form name="profileForm" onSubmit={handleSubmit}>
            <Box
              sx={{
                maxWidth: 1200,
                mx: "auto",
                p: 3,
                position: "relative",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                Create Profile
              </Typography>
              <ImageField onChange={handleChange}></ImageField>
              <h2>General Information</h2>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <RequiredInputField
                  name="firstName"
                  label="First Name"
                  boxLabel="Enter first name"
                  value={formData.first_name}
                  onChange={(val) => handleChange("first_name", val)}
                />
                <RequiredInputField
                  label="Last Name"
                  boxLabel="Enter last name"
                  value={formData.last_name}
                  onChange={(val) => handleChange("last_name", val)}
                />
                <GenderSelectField
                  name="gender"
                  label="Gender"
                  boxLabel="Select gender"
                  value={formData.gender}
                  onChange={(val) => handleChange("gender", val)}
                ></GenderSelectField>
                <DateField
                  label="Born"
                  value={formData.dob}
                  onChange={(val) => handleChange("dob", val)}
                />
                <SelectField
                  label="Mother"
                  boxLabel="Select Mother"
                  value={formData.mother}
                  onChange={(val) => handleChange("mother_id", val)}
                  inputValue={familyData.filter(
                    (person) => person.gender === "Female"
                  )}
                ></SelectField>
                <SelectField
                  label="Father"
                  boxLabel="Select Father"
                  value={formData.father}
                  onChange={(val) => handleChange("father_id", val)}
                  inputValue={familyData.filter(
                    (person) => person.gender === "Male"
                  )}
                ></SelectField>
                <MultiSelectField
                  label="Spouse(s)"
                  boxLabel="Select spouse"
                  value={formData.spouses}
                  inputData={familyData}
                  formData={formData}
                  onChange={(val, index) =>
                    handleArrayChange("spouses", val, index)
                  }
                  onDelete={(index) => deleteArrayValue("spouses", index)}
                  field="spouses"
                ></MultiSelectField>
                <MultiSelectField
                  label="Children"
                  boxLabel="Select child"
                  value={formData.children}
                  inputData={familyData}
                  formData={formData}
                  onChange={(val, index) =>
                    handleArrayChange("children", val, index)
                  }
                  onDelete={(index) => deleteArrayValue("children", index)}
                  field="children"
                ></MultiSelectField>
                <InputField
                  label="Birth Location"
                  boxLabel="Enter birth location"
                  value={formData.birth_location}
                  onChange={(val) => handleChange("birth_location", val)}
                />
                <InputField
                  label="Profession"
                  boxLabel="Enter profession"
                  value={formData.profession}
                  onChange={(val) => handleChange("profession", val)}
                />
              </Box>
              <Box mb={2} sx={{ width: "100%" }}>
                <h2>Life Description</h2>
              </Box>
              <LifeDescriptionField
                title="Early Life"
                label="Write about the early life of this person..."
                value={formData.early_life_description}
                onChange={(val) => handleChange("early_life_description", val)}
              />
              <LifeDescriptionField
                title="Young Adult Life"
                label="Write about the teenage years of this person..."
                value={formData.young_adult_description}
                onChange={(val) => handleChange("young_adult_description", val)}
              />
              <LifeDescriptionField
                title="Adult Life"
                label="Write about the adult life of this person..."
                value={formData.adult_life_description}
                onChange={(val) => handleChange("adult_life_description", val)}
              />
              <LifeDescriptionField
                title="Late Life"
                label="Write about the later year of life of this person..."
                value={formData.late_life_description}
                onChange={(val) => handleChange("late_life_description", val)}
              />
            </Box>
            {error && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center", // center horizontally
                  alignItems: "center", // center vertically
                }}
              >
                <Alert variant="filled" severity="error">
                  {error}
                </Alert>
              </Box>
            )}

            <Box
              sx={{
                py: 5,
                display: "flex",
                justifyContent: "center", // center horizontally
                alignItems: "center", // center vertically
              }}
            >
              <Button size="large" variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        )}
      </div>
    );
  }
}

export default AddProfileForm;
