import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import ProfileCard from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import "./Avatar.css";
import { img } from "framer-motion/client";

const imgId =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Portrait_of_J._D._Rockefeller.jpg/800px-Portrait_of_J._D._Rockefeller.jpg";

export default function Avatar() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <motion.div>
        {!expanded && (
          <motion.img
            className="avatar-img"
            onClick={toggleExpanded}
            src={imgId}
            alt="Avatar"
          />
        )}

        {expanded && (
          <ProfileCard
            imgId={imgId}
            name="D. Rockerfeller"
            dob="12/1/199"
            father="QB Rockerfeller"
            mother="Seline Gomez"
            lifeDescription="NOT a whole lot"
            onCollapse={toggleExpanded}
          />
        )}
      </motion.div>
    </div>
  );
}
