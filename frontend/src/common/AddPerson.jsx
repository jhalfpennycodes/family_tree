import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import ProfileCard from "../profile/ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import "./Node.css";
import { img } from "framer-motion/client";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

export default function AddPerson(props) {
  const [loading, setLoading] = useState(true);
  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
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
            <Link to="/addProfile">
              <motion.img
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.5 },
                }}
                whileTap={{ scale: 1 }}
                className="add-img"
                onClick={toggleExpanded}
                src={
                  "https://thumb.ac-illust.com/35/35df4f40a8e742121238c0fcd12cd384_t.jpeg"
                }
                alt={props.id}
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
