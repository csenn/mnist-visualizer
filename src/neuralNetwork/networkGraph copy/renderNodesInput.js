const d3 = window.d3;
import * as graphConstants from "./graphConstants";

export default function (svg, nodes, hasTrainingPoint) {
  const yScale = d3.scale
    .linear()
    .domain([0, nodes.length])
    .range([0, graphConstants.HEIGHT - graphConstants.HEADER_HEIGHT]);

  // Bind data
  const elems = svg.selectAll(".input-nodes").data(nodes, (d, i) => i); // Using index as key for stable updates

  // Remove old elements
  elems.exit().remove();

  // Enter selection: Create new elements
  const enteringElems = elems
    .enter()
    .append("rect")
    .attr("class", "input-nodes");

  // Merge enter and update selections
  enteringElems
    .merge(elems)
    .attr("width", graphConstants.INPUT_LAYER_NODE_WIDTH)
    .attr("height", yScale(1) || 5) // Ensure a minimum height
    .attr("stroke-width", ".1")
    .attr("stroke", (d) => {
      if (hasTrainingPoint) {
        return d.activation
          ? graphConstants.WITH_TRAINING_ON
          : graphConstants.WITH_TRAINING_OFF;
      }
      return "black";
    })
    .attr("fill", (d) => {
      if (hasTrainingPoint) {
        return d.activation
          ? graphConstants.WITH_TRAINING_ON
          : graphConstants.WITH_TRAINING_OFF;
      }
      return "rgb(230, 230, 230)";
    })
    .attr("transform", (d, nodeIndex) => {
      const y = yScale(nodeIndex);
      return `translate(0, ${y})`;
    });
}
