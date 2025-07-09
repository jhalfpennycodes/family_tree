import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import ContactPageIcon from "@mui/icons-material/ContactPage";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ProfileCard(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClick = (event) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Link>
            <EditIcon></EditIcon>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link>
            <DeleteIcon></DeleteIcon>
          </Link>
        </MenuItem>
      </Menu>
      <Card
        sx={{
          width: 250,
          display: "flex",
          flexDirection: "column",
          borderRadius: 1,
        }}
      >
        <CardHeader
          avatar={
            <Link to={`/profile/${props.id}`}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    boxShadow: 5,
                    transform: "scale(1.2)",
                  },
                }}
              >
                <img
                  src={props.avatar_img}
                  alt={`${props.firstName} ${props.lastName}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Avatar>
            </Link>
          }
          action={
            <React.Fragment>
              <Link to={`/profile/${props.id}`}>
                <IconButton>
                  <ContactPageIcon sx={{ color: "action.active" }} />
                </IconButton>
              </Link>
              <IconButton>
                <CancelIcon onClick={props.onCollapse}></CancelIcon>
              </IconButton>
            </React.Fragment>
          }
          title={
            <Typography fontWeight="bold">{`${props.firstName} ${props.lastName}`}</Typography>
          }
        />
        <CardContent disableSpacing={true}>
          <Typography variant="body2" sx={{ mb: 0.3, color: "text.secondary" }}>
            <b>Mother:</b> {props.mother}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.3, color: "text.secondary" }}>
            <b>Father:</b> {props.father}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="body2"
              sx={{ mb: 0.3, color: "text.secondary" }}
            >
              <b>Born:</b> {props.dob}
            </Typography>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{ ml: 1 }} // Optional spacing from the text
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Box>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography sx={{ color: "text.secondary" }}>
              <b>Other information:</b>
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 0.5, color: "text.secondary" }}
            >
              <b>Gender:</b> {props.gender}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 0.5, color: "text.secondary" }}
            >
              <b>Profession:</b> {props.profession}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </React.Fragment>
  );
}
