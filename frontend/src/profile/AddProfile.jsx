import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  Select,
  InputLabel,
  Button,
} from "@mui/material";
import rockerfellers from "../rockefellerFamily.json";
import MenuItem from "@mui/material/MenuItem";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import dayjs from "dayjs";

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

function SelectField({ label, value, onChange, inputValue, boxLabel }) {
  const [selectedId, setSelectedId] = useState("");

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    onChange(e.target.value);
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
          renderValue={(selected) => {
            if (selectedId === 0) {
              console.log("HIT");
              return <em>Unknown</em>;
            }
            console.log(selected);
            const person = inputValue.find((p) => p.id === selected);
            return person ? person.name : <em>Unkown</em>;
          }}
        >
          <MenuItem value="" key={0}>
            <em>Unknown</em>
          </MenuItem>
          {inputValue.map((person, index) => (
            <MenuItem key={index} value={person.id}>
              {person.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
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

function AddProfileForm(props) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: null,
    mother_id: "",
    father_id: "",
    birth_location: "",
    profession: "",
    early_life_description: "",
    young_adult_description: "",
    adult_life_description: "",
    late_life_description: "",
    avatar_img: "",
    images: [],
  });

  const handleChange = (field, value) => {
    console.log("hit");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.gender) {
      alert("Please select a gender");
    }
    if (!formData.dob) {
      alert("Please select a date of birth");
    }
    if (
      formData.first_name &&
      formData.last_name &&
      formData.gender &&
      formData.dob
    ) {
      console.log("About to send POST request...");
      fetch("http://127.0.0.1:5000/familyTree/family/1", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Form as JSON object:", formData);
      console.log("As JSON string:", JSON.stringify(formData));
    }
  };

  return (
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
            value={formData.mother}
            onChange={(val) => handleChange("mother_id", val)}
            inputValue={rockerfellers}
            boxLabel="Select Mother"
          ></SelectField>
          <SelectField
            label="Father"
            value={formData.father}
            onChange={(val) => handleChange("father_id", val)}
            inputValue={rockerfellers}
            boxLabel="Select Father"
          ></SelectField>
          <InputField
            label="Birth Location"
            boxLabel="Enter birth location"
            value={formData.birth_location}
            onChange={(val) => handleChange("birth_location", val)}
          />
          <InputField label="Profession" boxLabel="Enter profession" />
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
          justifyContent: "center", // center horizontally
          alignItems: "center", // center vertically
        }}
      >
        <Button size="large" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
}

export default AddProfileForm;
