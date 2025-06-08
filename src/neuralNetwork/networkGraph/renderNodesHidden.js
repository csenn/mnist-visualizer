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

  function getYScale(index) {
    return d3.scale
      .linear()
      .domain([0, hiddenLayers[index].length])
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

  const layers = svg.selectAll(".hidden-node-layers").data(hiddenLayers);

  layers.exit().remove();

  const layersEnter = layers
    .enter()
    .append("g")
    .attr("class", "hidden-node-layers");

  layersEnter
    .attr("data-layer-index", (d, layerIndex) => layerIndex)
    .attr("transform", (d, layerIndex) => {
      const x = xScale(layerIndex + 1);
      return `translate(${x}, 0)`;
    });

  layers
    .attr("data-layer-index", (d, layerIndex) => layerIndex)
    .attr("transform", (d, layerIndex) => {
      const x = xScale(layerIndex + 1);
      return `translate(${x}, 0)`;
    });

  const elems = layers.selectAll(".hidden-nodes").data((d) => d);

  elems.exit().remove();

  const enteringElems = elems
    .enter()
    .append("g")
    .attr("class", "hidden-nodes");

  enteringElems.attr("transform", function (d, nodeIndex) {
    const layerIndex = +this.parentNode.getAttribute("data-layer-index");
    const y = getYScale(layerIndex)(nodeIndex);
    return `translate(0, ${y})`;
  });

  elems.attr("transform", function (d, nodeIndex) {
    const layerIndex = +this.parentNode.getAttribute("data-layer-index");
    const y = getYScale(layerIndex)(nodeIndex);
    return `translate(0, ${y})`;
  });

  // Rectangle Node
  enteringElems
    .append("rect")
    .attr("class", "hidden-node-rect")
    .attr("width", graphConstants.HIDDEN_LAYER_NODE_WIDTH)
    .attr("height", function (d, nodeIndex) {
      const layerIndex = +this.parentNode.getAttribute("data-layer-index");
      return getYScale(layerIndex)(1) - 4;
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

  elems
    .select(".hidden-node-rect")
    .attr("width", graphConstants.HIDDEN_LAYER_NODE_WIDTH)
    .attr("height", function (d, nodeIndex) {
      const layerIndex = +this.parentNode.getAttribute("data-layer-index");
      return getYScale(layerIndex)(1) - 4;
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

  // Rectangle Node Label
  enteringElems
    .append("text")
    .attr("class", "hidden-node-text")
    .attr("dx", graphConstants.HIDDEN_LAYER_NODE_WIDTH / 2)
    .attr("font-size", 10)
    .attr("dy", function (d, nodeIndex) {
      const layerIndex = +this.parentNode.getAttribute("data-layer-index");
      return getYScale(layerIndex)(1) / 2;
    })
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("display", hasTrainingPoint ? "inherit" : "none")
    .attr("stroke", (d) => (isActiveNode(d.activation) ? "black" : "white"))
    .text((d) => d.activation);

  elems
    .select(".hidden-node-text")
    .attr("dx", graphConstants.HIDDEN_LAYER_NODE_WIDTH / 2)
    .attr("font-size", 10)
    .attr("dy", function (d, nodeIndex) {
      const layerIndex = +this.parentNode.getAttribute("data-layer-index");
      return getYScale(layerIndex)(1) / 2;
    })
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("display", hasTrainingPoint ? "inherit" : "none")
    .attr("stroke", (d) => (isActiveNode(d.activation) ? "black" : "white"))
    .text((d) => d.activation);

  // Bias Label Entering
  enteringElems
    .append("text")
    .attr("class", "bias")
    .attr("dx", function () {
      const { BIAS_LABEL_WIDTH, HIDDEN_LAYER_NODE_WIDTH } = graphConstants;
      return hasTrainingPoint
        ? -BIAS_LABEL_WIDTH + BIAS_LABEL_WIDTH / 2
        : -BIAS_LABEL_WIDTH +
            BIAS_LABEL_WIDTH / 2 +
            HIDDEN_LAYER_NODE_WIDTH / 2;
    })
    .attr("font-size", 11)
    .attr("dy", function (d, nodeIndex) {
      const layerIndex = +this.parentNode.getAttribute("data-layer-index");
      return getYScale(layerIndex)(1) / 2;
    })
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("stroke", "black")
    .attr("cursor", "pointer")
    .text((d) => d.bias);

  const biasLabels = elems
    .select(".bias")
    .attr("dx", () => {
      const { BIAS_LABEL_WIDTH, HIDDEN_LAYER_NODE_WIDTH } = graphConstants;
      return hasTrainingPoint
        ? -BIAS_LABEL_WIDTH + BIAS_LABEL_WIDTH / 2
        : -BIAS_LABEL_WIDTH +
            BIAS_LABEL_WIDTH / 2 +
            HIDDEN_LAYER_NODE_WIDTH / 2;
    })
    .attr("font-size", 11)
    .attr("dy", function (d, nodeIndex) {
      const layerIndex = +this.parentNode.getAttribute("data-layer-index");
      return getYScale(layerIndex)(1) / 2;
    })
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("stroke", "black")
    .attr("cursor", "pointer")
    .text((d) => d.bias);

  biasLabels.on("click", (d, nodeIndex, layerIndex) => {
    dispatch(setLayerModal({ nodeIndex, layerIndex }));
    d3.event.stopPropagation();
  });
}
