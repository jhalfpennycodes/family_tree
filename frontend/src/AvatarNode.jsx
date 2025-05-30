import React from "react";
import { Handle, Position } from "@xyflow/react";
import Avatar from "./Avatar"; // your avatar UI component

const AvatarNode = ({ data }) => {
  return (
    <div>
      <Avatar />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, width: 10, height: 10 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, width: 10, height: 10 }}
      />
    </div>
  );
};

export default AvatarNode;
