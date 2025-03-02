const d3 = window.d3;
import * as graphConstants from "./graphConstants";

export default function (svg, edgeLayers, nodes, hasTrainingData) {
  const xScale = d3.scale
    .linear()
    .domain([0, nodes.length - 1])
    .range([
      graphConstants.INPUT_LAYER_NODE_WIDTH,
      graphConstants.WIDTH - graphConstants.OUTPUT_LAYER_LABEL,
    ]);

  function getYScale(index) {
    return d3.scale
      .linear()
      .domain([0, nodes[index].length])
      .range([0, graphConstants.HEIGHT - graphConstants.HEADER_HEIGHT]);
  }

  // ---- Edge Layers ----
  const edgeBoxes = svg.selectAll(".edge-layer").data(edgeLayers, (d, i) => i);

  edgeBoxes.exit().remove(); // Remove outdated layers

  const edgeBoxesEnter = edgeBoxes
    .enter()
    .append("g")
    .attr("class", "edge-layer");

  const mergedEdgeBoxes = edgeBoxesEnter.merge(edgeBoxes);

  // ---- Edges (Lines) ----
  const edges = mergedEdgeBoxes.selectAll(".edge").data(
    (d) => d,
    (d, i) => i,
  );

  edges.exit().remove(); // Remove outdated edges

  const edgesEnter = edges.enter().append("line").attr("class", "edge");

  const mergedEdges = edgesEnter.merge(edges);

  // ---- Update Edge Attributes ----
  mergedEdges
    .attr("x1", (d, i, nodesArray) => {
      const layerIndex = edgeLayers.findIndex((layer) => layer.includes(d));
      if (layerIndex === 0) {
        return graphConstants.INPUT_LAYER_NODE_WIDTH;
      }
      return hasTrainingData
        ? xScale(layerIndex) + graphConstants.BIAS_LABEL_WIDTH - 5
        : xScale(layerIndex) + graphConstants.BIAS_LABEL_WIDTH / 2 - 5;
    })
    .attr("x2", (d, i, nodesArray) => {
      const layerIndex = edgeLayers.findIndex((layer) => layer.includes(d));
      const { BIAS_LABEL_WIDTH, OUTPUT_LAYER_NODE_WIDTH } = graphConstants;

      if (layerIndex === edgeLayers.length - 1) {
        return (
          xScale(layerIndex + 1) - BIAS_LABEL_WIDTH - OUTPUT_LAYER_NODE_WIDTH
        );
      }
      return hasTrainingData
        ? xScale(layerIndex + 1) - BIAS_LABEL_WIDTH
        : xScale(layerIndex + 1) - BIAS_LABEL_WIDTH / 2 - 5;
    })
    .attr("y1", (d, i, nodesArray) => {
      const layerIndex = edgeLayers.findIndex((layer) => layer.includes(d));
      return (
        getYScale(layerIndex)(d.source.index) + getYScale(layerIndex)(1) / 2
      );
    })
    .attr("y2", (d, i, nodesArray) => {
      const layerIndex = edgeLayers.findIndex((layer) => layer.includes(d));
      return (
        getYScale(layerIndex + 1)(d.target.index) +
        getYScale(layerIndex + 1)(1) / 2
      );
    })
    .attr("stroke-width", (d, i, nodesArray) => {
      const layerIndex = edgeLayers.findIndex((layer) => layer.includes(d));
      const thicken = edgeLayers[layerIndex].length < 1000;
      let zScore = Math.abs(d.zScore);
      zScore = Math.min(zScore, 6); // Clamp to max 6

      if (hasTrainingData) {
        return thicken ? zScore * 0.8 : zScore * 0.08;
      } else {
        return thicken ? zScore * 0.6 : zScore * 0.07;
      }
    })
    .style("stroke", (d) => {
      if (hasTrainingData) {
        return d.isOn
          ? graphConstants.WITH_TRAINING_ON
          : graphConstants.WITH_TRAINING_OFF;
      } else {
        return d.weight > 0
          ? graphConstants.NO_TRAINING_NEGATIVE
          : graphConstants.NO_TRAINING_POSITIVE;
      }
    });
}
