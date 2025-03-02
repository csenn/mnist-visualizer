import _ from "lodash";
const d3 = window.d3;

import * as graphConstants from "./graphConstants";
import { setLayerModal, setDigitModal } from "../data/neuralNetworkActions";

const checkboxSvg = `
  <svg style="display:inline-block;height:40px;width:40px;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;fill:#43A047;">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
  </svg>
`;

const closeSvg = `
  <svg style="display:inline-block;height:40px;width:40px;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;fill:#e53935">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
  </svg>
`;

export default function (
  svg,
  nodes,
  lastActivations,
  selectedDrawing,
  testResultsSummary,
  dispatch,
  layer,
) {
  let maxIndex = null;
  const hasTrainingPoint = !!selectedDrawing;

  if (lastActivations) {
    const activations = _.flatten(lastActivations);
    maxIndex = _.findIndex(activations, (a) => a === _.max(activations));
  }

  const yScale = d3.scale
    .linear()
    .domain([0, nodes.length])
    .range([0, graphConstants.HEIGHT - graphConstants.HEADER_HEIGHT]);

  // Bind data
  const elems = svg.selectAll(".output-nodes").data(nodes, (d, i) => i);

  elems.exit().remove(); // Remove outdated elements

  const enteringElems = elems
    .enter()
    .append("g")
    .attr("class", "output-nodes")
    .attr("transform", (d, nodeIndex) => {
      const { WIDTH, OUTPUT_LAYER_NODE_WIDTH, OUTPUT_LAYER_LABEL } =
        graphConstants;
      const x = WIDTH - OUTPUT_LAYER_NODE_WIDTH - OUTPUT_LAYER_LABEL;
      const y = yScale(nodeIndex) + 2;
      return `translate(${x}, ${y})`;
    });

  const mergedElems = enteringElems.merge(elems);

  // Add & update rect elements
  enteringElems.append("rect").attr("class", "output-rect");
  enteringElems.append("rect").attr("class", "overlapping-rect");
  enteringElems.append("text").attr("class", "bias");
  enteringElems.append("text").attr("class", "output-number-label");
  enteringElems.append("text").attr("class", "percentage-label");

  mergedElems
    .selectAll(".output-rect")
    .attr(
      "width",
      graphConstants.OUTPUT_LAYER_NODE_WIDTH -
        graphConstants.OUTPUT_LAYER_LABEL,
    )
    .attr("height", yScale(1) - 4)
    .attr("ry", 3)
    .attr("fill", (d, i) => {
      if (hasTrainingPoint) {
        return i === maxIndex
          ? graphConstants.WITH_TRAINING_ON
          : graphConstants.WITH_TRAINING_OFF;
      }
      return graphConstants.NO_TRAINING_POSITIVE;
    });

  // Update overlapping rect
  mergedElems
    .selectAll(".overlapping-rect")
    .attr(
      "width",
      graphConstants.OUTPUT_LAYER_NODE_WIDTH -
        graphConstants.OUTPUT_LAYER_LABEL,
    )
    .attr("ry", 3)
    .attr("fill", graphConstants.NO_TRAINING_NEGATIVE)
    .attr("height", (d, i) => {
      if (hasTrainingPoint) {
        return 0;
      }
      const { correctCount, wrongCount } = testResultsSummary[i] || {
        correctCount: 0,
        wrongCount: 1,
      };
      const fraction = correctCount / (wrongCount + correctCount);
      return Math.min((1 - fraction) * yScale(1), yScale(1) - 4);
    });

  // Accuracy text
  mergedElems
    .selectAll(".percentage-label")
    .attr(
      "dx",
      (graphConstants.OUTPUT_LAYER_NODE_WIDTH -
        graphConstants.OUTPUT_LAYER_LABEL) /
        2,
    )
    .attr("dy", yScale(1) / 2)
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".8")
    .attr("stroke", "white")
    .text((d, i) => {
      if (hasTrainingPoint) {
        return d.activation;
      } else {
        const { correctCount, wrongCount } = testResultsSummary[i] || {
          correctCount: 0,
          wrongCount: 1,
        };
        return `${Math.round((correctCount / (wrongCount + correctCount)) * 100)}%`;
      }
    });

  // Number Labels
  const numberLabels = mergedElems
    .selectAll(".output-number-label")
    .attr("dx", graphConstants.OUTPUT_LAYER_NODE_WIDTH)
    .attr("dy", yScale(1) / 2 + 4)
    .attr("stroke-width", "2")
    .attr("font-size", 28)
    .attr("text-anchor", "middle")
    .attr("stroke", "rgb(60,60,60)")
    .attr("cursor", "pointer")
    .text((d, i) => i);

  numberLabels.on("click", (event, d, nodeIndex) => {
    console.log("sssaslkajsd", nodeIndex);
    dispatch(setDigitModal(nodeIndex));
    event.stopPropagation();
  });

  // Bias Labels
  const biasLabels = mergedElems
    .selectAll(".bias")
    .attr(
      "dx",
      -graphConstants.BIAS_LABEL_WIDTH + graphConstants.BIAS_LABEL_WIDTH / 2,
    )
    .attr("dy", yScale(1) - yScale(1) / 2)
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("stroke-width", ".5")
    .attr("stroke", "black")
    .attr("cursor", "pointer")
    .text((d) => d.bias);

  biasLabels.on("click", (event, d, nodeIndex) => {
    dispatch(setLayerModal({ nodeIndex, layerIndex: layer - 1 }));
    event.stopPropagation();
  });

  // Add result icons
  svg.selectAll(".result-icon-box").remove();
  if (_.isNumber(maxIndex)) {
    svg
      .append("g")
      .attr("class", "result-icon-box")
      .attr("transform", () => {
        const width = graphConstants.WIDTH;
        const height =
          selectedDrawing.yIndex === maxIndex
            ? yScale(maxIndex) + 12
            : yScale(maxIndex) + 15;
        return `translate(${width - 20}, ${height})`;
      })
      .html(() =>
        selectedDrawing.yIndex === maxIndex ? checkboxSvg : closeSvg,
      );
  }
}
