import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Background,
  ReactFlow,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import { useParams } from "react-router-dom";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import AvatarNode from "../graph/AvatarNode";
import AddPersonNode from "../graph/AddPersonNode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../authentication/AuthProvider";

const LOCAL_SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL;
const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "150",
  "elk.spacing.nodeNode": "80",
};

const getLayoutedElements = async (nodes, edges, options = {}) => {
  const nodeIds = nodes.map((n) => n.id);

  const invalidEdges = edges.filter(
    (edge) => !nodeIds.includes(edge.source) || !nodeIds.includes(edge.target)
  );

  if (invalidEdges.length > 0) {
    console.warn(
      "Invalid edges found (source/target not in nodes):",
      invalidEdges
    );
  }

  try {
    const isHorizontal = options?.["elk.direction"] === "RIGHT";
    const graph = {
      id: "root",
      layoutOptions: options,
      children: nodes.map((node) => ({
        ...node,
        targetPosition: isHorizontal ? "right" : "bottom",
        sourcePosition: isHorizontal ? "left" : "top",
        width: 150,
        height: 50,
      })),
      edges: edges,
    };

    const layoutedGraph = await elk.layout(graph);

    const result = {
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
      edges:
        layoutedGraph.edges?.map((edge) => ({
          ...edge,
          type: edge.type || "smoothstep", // Preserve existing type or default
          // Ensure all required properties are present
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })) ||
        edges.map((edge) => ({
          // Fallback to original edges if ELK doesn't return any
          ...edge,
          type: "smoothstep",
        })),
    };

    return result;
  } catch (error) {
    console.error("Layout error:", error);
    // Return fallback data instead of undefined
    return {
      nodes: nodes.map((node) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
      })),
      edges: edges.map((edge) => ({
        ...edge,
        type: "smoothstep",
      })),
    };
  }
};

const nodeTypes = { avatar: AvatarNode, add: AddPersonNode };

function LayoutFlow() {
  const [graphIsLoading, setGraphIsLoading] = useState(true);
  const [loadTimer, setLoadTimer] = useState(0);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const hasCalledFitView = useRef(false);
  const { familyId } = useParams();
  const { token } = useAuth();
  const getTree = async () => {
    try {
      const response = await fetch(
        LOCAL_SERVER_URL + `tree/getPublicTree/${familyId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Could not complete GET request");
      }

      const json = await response.json();

      if (json && json[0]) {
        const opts = { "elk.direction": "DOWN", ...elkOptions };

        try {
          const layoutResult = await getLayoutedElements(
            json[0].nodes,
            json[0].edges,
            opts
          );

          if (layoutResult && layoutResult.nodes && layoutResult.edges) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = layoutResult;

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
          } else {
            console.error("Layout result is invalid:", layoutResult);
            setNodes(json[0].nodes);
            setEdges(json[0].edges);
          }
        } catch (layoutError) {
          console.error("Layout error:", layoutError);
          setNodes(json[0].nodes);
          setEdges(json[0].edges);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Use onNodesChange to detect when all nodes are rendered
  const handleNodesChange = useCallback(() => {
    // Only fit view once after nodes are set and rendered
    if (nodes.length > 0 && !hasCalledFitView.current && graphIsLoading) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          fitView({
            duration: 800,
          });
          setGraphIsLoading(false);
          hasCalledFitView.current = true;
        }, 200);
      });
    }
  }, [nodes.length, fitView, graphIsLoading]);

  useEffect(() => {
    getTree();
    if (!graphIsLoading) {
      setLoadTimer(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Call handleNodesChange when nodes change
  useEffect(() => {
    handleNodesChange();
  }, [nodes, handleNodesChange]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // full viewport height
        width: "100vw", // full viewport width (optional)
      }}
    >
      {!graphIsLoading ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          style={{ backgroundColor: "#F7F9FB" }}
          panOnScroll={{ Free: "free" }}
          panOnScrollSpeed={1}
          minZoom={0.3}
          onInit={() => {
            // Additional fit view call when ReactFlow initializes
            setTimeout(() => {
              if (nodes.length > 0) {
                fitView({
                  padding: { top: 0.1, right: 0.1, bottom: 0.2, left: 0.1 },
                  includeHiddenNodes: false,
                  duration: 800,
                });
              }
            }, 100);
          }}
        >
          <Controls position="top-right" showInteractive={false} />
          <MiniMap />
          <Background />
        </ReactFlow>
      ) : (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <CircularProgress />
          {loadTimer >= 10 && (
            <Box style={{ paddingTop: "10px" }}>
              Still loading... Almost there!
            </Box>
          )}

          {loadTimer >= 5 && loadTimer < 7 && (
            <Box style={{ paddingTop: "10px" }}>Waking up the server...!</Box>
          )}
        </Box>
      )}
    </div>
  );
}

function PublicTree() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}

export default PublicTree;
