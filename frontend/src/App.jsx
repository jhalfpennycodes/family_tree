import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import AvatarNode from "./AvatarNode";

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

const initialNodes = [
  {
    id: "1",
    type: "avatar",
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "avatar",
    position: { x: 500, y: 0 },
    data: { value: 123 },
  },
  {
    id: "3",
    type: "avatar",
    position: { x: 500, y: 500 },
    data: { value: 123 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "step" },
  { id: "e2-3", source: "1", target: "3", type: "step" },
];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { avatar: AvatarNode };

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={rfStyle}
      panOnScroll
    />
  );
}

export default Flow;
