import { initialNodes, initialEdges, newNodes } from "./initialElements.js";
import ELK from "elkjs/lib/elk.bundled.js";
import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  Background,
  ReactFlow,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import AvatarNode from "./AvatarNode";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
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
      const ns = useInitialNodes ? newNodes : nodes;
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

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: "DOWN", useInitialNodes: true });
  }, []);

  const [theme, setTheme] = useCallback("light");
  function handleThemChange(event) {
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

export default () => (
  <ReactFlowProvider>
    <LayoutFlow />
  </ReactFlowProvider>
);
