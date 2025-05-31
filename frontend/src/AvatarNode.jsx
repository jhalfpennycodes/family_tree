import React from "react";
import { Handle, Position } from "@xyflow/react";
import Avatar from "./Avatar"; // your avatar UI component
import datas from "./rockefellerFamily.json";

const AvatarNode = ({ data }) => {
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
        imgUrl={data.imgUrl}
        name={data.name}
        dob={data.dob}
        father={data.father}
        mother={data.mother}
        lifeDescription={data.lifeDescription}
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
