import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import ProfileCard from "../profile/ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import "./Node.css";
import { img } from "framer-motion/client";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Avatar(props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };
  const [initials, setInitials] = useState("");

  const handleInitials = async () => {
    try {
      const response = await fetch(`https://ui-avatars.com/api/?name=John+Doe`);

      console.log("Initial data: ", response);
      setInitials(response.body);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  setTimeout(() => {
    setLoading(false);
  }, "10");

  return (
    <div>
      {loading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            layout
            transition={{
              default: { type: "spring" },
              opacity: { ease: "linear" },
            }}
          >
            {!expanded && (
              <motion.img
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.5 },
                }}
                whileTap={{ scale: 1 }}
                className="avatar-img"
                onClick={toggleExpanded}
                src={
                  // `https://ui-avatars.com/api/?name=${props.id}`
                  props.avatar_img
                    ? props.avatar_img
                    : `https://ui-avatars.com/api/?name=${props.first_name}+${props.last_name}`
                }
                onError={handleInitials}
                alt={`${props.first_name} ${props.last_name}`}
              />
            )}

            {expanded && (
              <ProfileCard
                id={props.id}
                avatar_img={props.avatar_img}
                firstName={props.first_name}
                lastName={props.last_name}
                gender={props.gender}
                dob={props.dob}
                father={props.father ? props.father : "Unknown"}
                mother={props.mother ? props.mother : "Unknown"}
                profession={props.profession}
                onCollapse={toggleExpanded}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
