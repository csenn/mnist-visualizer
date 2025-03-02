const d3 = window.d3;
import * as graphConstants from "./graphConstants";
import { setLayerModal } from "../data/neuralNetworkActions";

export default function (
  svg,
  hiddenLayers,
  hasTrainingPoint,
  dispatch,
  selectedNetworkSummary,
) {
  const xScale = d3.scale
    .linear()
    .domain([0, hiddenLayers.length + 1])
    .range([
      graphConstants.INPUT_LAYER_NODE_WIDTH,
      graphConstants.WIDTH - graphConstants.OUTPUT_LAYER_LABEL,
    ]);

  function getYScale(d) {
    const layerIndex = hiddenLayers.findIndex((layer) =>
      layer.find((node) => node.bias === d.bias),
    );

    if (layerIndex === -1) {
      console.log("bad", layerIndex, hiddenLayers, d);

      return d3.scale
        .linear()
        .domain([0, 1])
        .range([0, graphConstants.HEIGHT - graphConstants.HEADER_HEIGHT]);
    }

    // const layerIndex = 0

    return d3.scale
      .linear()
      .domain([0, hiddenLayers[layerIndex].length])
      .range([0, graphConstants.HEIGHT - graphConstants.HEADER_HEIGHT]);
  }

  function isActiveNode(num) {
    if (selectedNetworkSummary.activation === "Logistic") {
      return num > 0.5;
    } else if (selectedNetworkSummary.activation === "Tanh") {
      return num > 0;
    }
    throw new Error("Unexpected activation type");
  }

  // ---- Layer Groups ----
  const layers = svg
    .selectAll(".hidden-node-layers")
    .data(hiddenLayers, (d, i) => i);

  layers.exit().remove(); // Remove outdated layers

  const layersEnter = layers
    .enter()
    .append("g")
    .attr("class", "hidden-node-layers")
    .attr(
      "transform",
      (d, layerIndex) => `translate(${xScale(layerIndex + 1)}, 0)`,
    );

  const mergedLayers = layersEnter.merge(layers);

  // ---- Nodes ----
  const nodes = mergedLayers.selectAll(".hidden-nodes").data(
    (d) => d,
    (d, i) => i,
  ); // Binding individual nodes

  nodes.exit().remove(); // Remove outdated nodes

  const nodesEnter = nodes
    .enter()
    .append("g")
    .attr("class", "hidden-nodes")
    .attr("transform", (d, nodeIndex, nodesArray) => {
      return `translate(0, ${getYScale(d)(nodeIndex)})`;
    });

  const mergedNodes = nodesEnter.merge(nodes);

  // ---- Node Rectangles ----
  nodesEnter.append("rect").attr("class", "hidden-node-rect");

  mergedNodes
    .selectAll(".hidden-node-rect")
    .attr("width", graphConstants.HIDDEN_LAYER_NODE_WIDTH)
    .attr("height", (d, nodeIndex, nodesArray) => {
      // const layerIndex = hiddenLayers.findIndex(layer => layer.includes(d));
      return getYScale(d)(1) - 4;
    })
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("display", hasTrainingPoint ? "inherit" : "none")
    .attr("stroke", (d) =>
      isActiveNode(d.activation)
        ? graphConstants.WITH_TRAINING_ON
        : graphConstants.WITH_TRAINING_OFF,
    )
    .attr("fill", (d) =>
      isActiveNode(d.activation)
        ? graphConstants.WITH_TRAINING_ON
        : graphConstants.WITH_TRAINING_OFF,
    );

  // ---- Node Text Labels ----
  nodesEnter.append("text").attr("class", "hidden-node-text");

  mergedNodes
    .selectAll(".hidden-node-text")
    .attr("dx", graphConstants.HIDDEN_LAYER_NODE_WIDTH / 2)
    .attr("dy", (d, nodeIndex, nodesArray) => {
      // const layerIndex = hiddenLayers.findIndex(layer => layer.includes(d));
      return getYScale(d)(1) / 2;
    })
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("display", hasTrainingPoint ? "inherit" : "none")
    .attr("stroke", (d) => (isActiveNode(d.activation) ? "black" : "white"))
    .text((d) => d.activation);

  // ---- Bias Labels ----
  nodesEnter.append("text").attr("class", "bias");

  mergedNodes
    .selectAll(".bias")
    .attr("dx", () => {
      const { BIAS_LABEL_WIDTH, HIDDEN_LAYER_NODE_WIDTH } = graphConstants;
      return hasTrainingPoint
        ? -BIAS_LABEL_WIDTH + BIAS_LABEL_WIDTH / 2
        : -BIAS_LABEL_WIDTH +
            BIAS_LABEL_WIDTH / 2 +
            HIDDEN_LAYER_NODE_WIDTH / 2;
    })
    .attr("dy", (d, nodeIndex, nodesArray) => {
      // const layerIndex = hiddenLayers.findIndex(layer => layer.includes(d));
      return getYScale(d)(1) / 2;
    })
    .attr("font-size", 11)
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("stroke", "black")
    .attr("cursor", "pointer")
    .text((d) => d.bias)
    .on("click", function (event, d) {
      const nodeIndex = hiddenLayers
        .find((layer) => layer.includes(d))
        .indexOf(d);
      const layerIndex = hiddenLayers.findIndex((layer) => layer.includes(d));

      dispatch(setLayerModal({ nodeIndex, layerIndex }));
      d3.select(this).dispatch("click"); // Proper event handling for newer D3 versions
    });
}
