import {
  Alert,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function NoProfile() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            No Profile, click here to create one!
          </Typography>
          <Link to="/addProfile">
            <Button
              required
              type="submit"
              variant="contained"
              sx={{ width: "80%", mt: 1 }}
            >
              Create Profile
            </Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
