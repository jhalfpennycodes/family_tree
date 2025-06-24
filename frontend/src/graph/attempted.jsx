import ELK from "elkjs/lib/elk.bundled.js";
import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  Background,
  ReactFlow,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import axios from "axios";
import "@xyflow/react/dist/style.css";
import AvatarNode from "./AvatarNode";
import { initialEdges } from "../initialElements";
const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "150",
  "elk.spacing.nodeNode": "80",
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "right" : "bottom",
      sourcePosition: isHorizontal ? "left" : "top",

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges.map((edge) => ({
        ...edge,
        type: "smoothstep",
      })),
    }))
    .catch(console.error);
};
const nodeTypes = { avatar: AvatarNode };

function LayoutFlow() {
  // Use state to store the fetched data
  const [initialData, setInitialData] = useState({ nodes: [], edges: [] });
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/tree/1");
      const fetchedNodes = response.data[0].nodes;
      const fetchedEdges = initialEdges;
      // Store in state instead of regular variables
      setInitialData({ nodes: fetchedNodes, edges: fetchedEdges });
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      // Use the state data instead of undefined variables
      const ns = useInitialNodes ? initialData.nodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          fitView();
        }
      );
    },
    [nodes, edges]
  );

  // Fetch data on mount
  React.useEffect(() => {
    fetchAPI();
  }, []);

  // Calculate the initial layout when data is loaded
  useLayoutEffect(() => {
    if (dataLoaded) {
      onLayout({ direction: "DOWN", useInitialNodes: true });
    }
  }, [dataLoaded, onLayout]);

  const [theme, setTheme] = useState("light"); // Fix: use useState instead of useCallback

  function handleThemeChange(event) {
    let choice = event.target.value;
    console.log(choice);
    setTheme(choice);
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}

function Tree() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}

export default Tree;
