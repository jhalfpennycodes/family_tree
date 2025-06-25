import React from "react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import Avatar from "../common/Avatar"; // your avatar UI component
import datas from "../rockefellerFamily.json";
import { useState, useCallback, useEffect } from "react";

const AvatarNode = ({ data }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(data.id);
  }, [data.id, updateNodeInternals]);

  return (
    <div
      style={{
        width: 150,
        height: 50,
        position: "relative", // Ensure child elements like handles are relative to this box
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Avatar
        id={data.id}
        avatar_img={data.avatar_img}
        name={`${data.first_name} ${data.last_name}`}
        dob={data.dob}
        gender={data.gender}
        father={data.father}
        mother={data.mother}
        profession={data.profession}
      ></Avatar>
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
