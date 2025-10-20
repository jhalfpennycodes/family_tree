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
import { useNavigate, useParams } from "react-router-dom";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import AvatarNode from "./AvatarNode";
import AddPersonNode from "./AddPersonNode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../authentication/AuthProvider";
import NoData from "../common/NoData";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;
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
  const [noNodes, setNoNodes] = useState(false);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const hasCalledFitView = useRef(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const getTree = async () => {
    try {
      const response = await fetch(VITE_API_BASE + `tree/getTree`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 500) {
        navigate("/serverError");
        return;
      }
      if (response.status == 401 || response.status == 403) {
        const e = await response.json();
        console.log(e.error);
        if (e.error == "token_expired") {
          navigate("/sessionExpired");
          return;
        }
        if (e.error == "invalid_token") {
          navigate("/notAuthenticated");
          return;
        }
      }
      if (!response.ok) {
        throw new Error("Could not complete GET request");
      }

      const json = await response.json();
      if (json[0].nodes == 0) {
        setNoNodes(true);
        setGraphIsLoading(false);
      }

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

  // Handle initial fit view after nodes are fully rendered
  const handleInitialFitView = useCallback(() => {
    if (nodes.length > 0 && !hasCalledFitView.current) {
      // Multiple timeouts to ensure all nodes are measured
      setTimeout(() => {
        fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          duration: 800,
        });
        hasCalledFitView.current = true;
        setGraphIsLoading(false);
      }, 500);
    }
  }, [nodes.length, fitView]);

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

  // Call fit view when nodes are set and edges are ready
  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      handleInitialFitView();
    }
  }, [nodes.length, edges.length, handleInitialFitView]);

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
      {graphIsLoading ? (
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
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // full viewport height
            width: "100vw", // full viewport width (optional)
          }}
        >
          {noNodes ? (
            <ReactFlow>
              <NoData></NoData>
            </ReactFlow>
          ) : (
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
          )}
        </div>
      )}
    </div>
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
