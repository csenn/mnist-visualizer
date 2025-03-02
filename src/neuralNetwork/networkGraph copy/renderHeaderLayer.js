const d3 = window.d3;
import * as graphConstants from "./graphConstants";

export default function (svg, nodes) {
  const { WIDTH, OUTPUT_LAYER_LABEL, INPUT_LAYER_NODE_WIDTH } = graphConstants;

  if (!nodes || nodes.length === 0) {
    console.warn("Nodes array is empty or undefined.");
    return;
  }

  const edgeMessages = [];
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1].length;
    const b = nodes[i].length;
    edgeMessages.push(`${a * b} edges`);
  }

  const isLast = (index) => index === nodes.length - 1;

  const xScaleNodeLabel = d3.scale
    .linear()
    .domain([0, nodes.length - 1])
    .range([0, WIDTH - OUTPUT_LAYER_LABEL - INPUT_LAYER_NODE_WIDTH]);

  const xScaleEdgeLabel = d3.scale
    .linear()
    .domain([0, nodes.length - 1])
    .range([0, WIDTH - OUTPUT_LAYER_LABEL - INPUT_LAYER_NODE_WIDTH]);

  // --- NODE LABELS ---
  const nodeLabels = svg.selectAll(".header-node-labels").data(nodes);

  nodeLabels.exit().remove(); // Remove old elements

  const nodeLabelsEnter = nodeLabels
    .enter()
    .append("text")
    .attr("class", "header-node-labels");

  nodeLabelsEnter
    .merge(nodeLabels) // Merge enter and update selections
    .attr("dx", (d, i) => {
      if (i === 0) return xScaleNodeLabel(i);
      if (isLast(i)) return xScaleNodeLabel(i) - 75;
      return xScaleNodeLabel(i) - 25;
    })
    .attr("dy", 9)
    .attr("font-size", 12)
    .attr("text-anchor", "left")
    .style("fill", "rgb(60,60,60)")
    .text((d, i) => {
      if (i === 0) return "784 Input Nodes";
      if (isLast(i)) return `${nodes[i].length} Output Nodes`;
      return `${nodes[i].length} Hidden Nodes`;
    });

  // --- EDGE LABELS ---
  const edgeLabels = svg.selectAll(".header-edge-labels").data(edgeMessages);

  edgeLabels.exit().remove(); // Remove old elements

  const edgeLabelsEnter = edgeLabels
    .enter()
    .append("text")
    .attr("class", "header-edge-labels");

  edgeLabelsEnter
    .merge(edgeLabels) // Merge enter and update selections
    .attr(
      "dx",
      (d, i) => xScaleEdgeLabel(i) + (xScaleEdgeLabel(1) / 2 || 0) - 30,
    )
    .attr("dy", 9)
    .attr("font-size", 12)
    .attr("text-anchor", "left")
    .style("fill", "rgb(110,110,110)")
    .text((d) => d);
}
