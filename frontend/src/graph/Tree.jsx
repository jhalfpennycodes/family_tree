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
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import AvatarNode from "./AvatarNode";
import AddPersonNode from "./AddPersonNode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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
  const [isLoading, setLoading] = useState(true);
  const [graphIsLoading, setGraphIsLoading] = useState(true);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const hasCalledFitView = useRef(false);

  const getTree = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/familyTree/tree/getTree/1",
        { method: "GET" }
      );
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
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
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
        >
          <Controls position="top-right" showInteractive={false} />
          <MiniMap />
          <Background />
        </ReactFlow>
      ) : (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <CircularProgress></CircularProgress>
        </Box>
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
