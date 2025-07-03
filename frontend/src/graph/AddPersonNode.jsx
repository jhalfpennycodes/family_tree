import React, { useEffect } from "react";
import AddPerson from "../common/AddPerson";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";

function AddPersonNode({ data }) {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(data.id);
    console.log(data);
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
      <AddPerson id={data.id}></AddPerson>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          left: "50%",
          top: 0,
          transform: "translate(-50%, -20%)",
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
          top: 0,
          transform: "translate(-50%, -20%)",
          width: 10,
          height: 10,
          opacity: 0,
          background: "#000",
        }}
      />
    </div>
  );
}

export default AddPersonNode;
