import React, { useEffect, useState } from "react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import Avatar from "../common/Avatar";

const AvatarNode = ({ data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    updateNodeInternals(data.id);
  }, [data.id, updateNodeInternals]);

  const handleClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        width: 150,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleClick}
    >
      <Avatar
        id={data.id}
        avatar_img={data.avatar_img}
        first_name={data.first_name}
        last_name={data.last_name}
        dob={data.dob}
        gender={data.gender}
        father={data.father}
        mother={data.mother}
        profession={data.profession}
      />

      {/* Label underneath */}
      {data.first_name && data.last_name && !isProfileOpen && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#4b5563", // Tailwind gray-600
            textAlign: "center",
          }}
        >
          {data.first_name} {data.last_name}
        </div>
      )}

      {/* Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 0,
          width: 10,
          height: 10,
          opacity: 0,
          background: "#000",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
          width: 10,
          height: 10,
          opacity: 0,
          background: "#000",
        }}
      />
    </div>
  );
};

export default AvatarNode;
