import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import ProfileCard from "../profile/ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import "./Avatar.css";
import { img } from "framer-motion/client";

export default function Avatar(props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
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
              src={props.imgUrl}
              alt={props.name}
            />
          )}

          {expanded && (
            <ProfileCard
              imgId={props.imgUrl}
              name={props.name}
              dob={props.dob}
              father={props.father}
              mother={props.mother}
              lifeDescription={props.lifeDescription}
              onCollapse={toggleExpanded}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
