import _ from "lodash";
import React from "react";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import { getNetwork } from "../data/neuralNetworkActions";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Table,
  TableBody,
  // TableHeader,
  TableCell,
  TableRow,
  Box,
  // TableCell
} from "@mui/material";

class NetworkChooser extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    this.state = {
      isOpen: false,
      selectedRowIndex: null,
    };
    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._onRowSelection = this._onRowSelection.bind(this);
    this._selectNetwork = this._selectNetwork.bind(this);
  }
  _openModal() {
    this.setState({ isOpen: true });
  }
  _closeModal() {
    this.setState({ isOpen: false });
  }
  _onRowSelection(vals) {
    this.setState({ selectedRowIndex: vals[0] });
  }
  _selectNetwork(index) {
    const path = this.props.networkSummaries[index].path;
    this.props.dispatch(getNetwork(path));
    this.setState({ isOpen: false });
  }
  _renderContent() {
    if (!this.props.networkSummaries) {
      return false;
    }
    const rows = this.props.networkSummaries.map((summary, index) => {
      const weight = summary.improvedWeightInit
        ? "Gaussian(0,1) * 1/sqrt(n)"
        : "Gaussian(0,1)";

      return (
        <TableRow
          key={summary.path}
          selected={this.state.selectedRowIndex === index}
          onClick={_.partial(this._onRowSelection, [index])}
        >
          <TableCell>
            <Checkbox checked={this.state.selectedRowIndex === index} />
          </TableCell>
          <TableCell>{summary.accuracy}</TableCell>
          <TableCell>{summary.hiddenNodes}</TableCell>
          <TableCell>{summary.eta}</TableCell>
          <TableCell>{summary.activation}</TableCell>
          <TableCell>{summary.cost}</TableCell>
          <TableCell style={{ width: "140px" }}>{weight}</TableCell>
        </TableRow>
      );
    });
    return (
      <Table size="small" style={{ fontFamily: "Raleway" }}>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Accuracy</TableCell>
          <TableCell>Hidden Layers</TableCell>
          <TableCell>Learning Rate</TableCell>
          <TableCell>Activation</TableCell>
          <TableCell>Cost</TableCell>
          <TableCell style={{ width: "140px" }}>Weight Init</TableCell>
        </TableRow>

        <TableBody deselectOnClickaway={false}>{rows}</TableBody>
      </Table>
    );
  }
  render() {
    const actions = [
      <Button
        label="Cancel"
        variant="contained"
        sx={{ backgroundColor: "#f5f5f5", color: "black" }}
        Choose
        a
        model
        to
        visualize
        onClick={this._closeModal}
      >
        Cancel
      </Button>,
    ];

    if (_.isNumber(this.state.selectedRowIndex)) {
      actions.push(
        <Button
          style={{ marginLeft: "10px" }}
          variant="contained"
          secondary
          onClick={_.partial(this._selectNetwork, this.state.selectedRowIndex)}
        >
          Select Network
        </Button>,
      );
    }

    return (
      <span>
        <Button secondary variant="contained" onClick={this._openModal}>
          Choose Network Design
        </Button>
        <Dialog
          actions={actions}
          modal={false}
          maxWidth="lg"
          contentStyle={{ width: "80%", maxWidth: "none" }}
          titleStyle={{ fontFamily: "Raleway" }}
          open={this.state.isOpen}
          onClose={this._closeModal}
        >
          <DialogTitle>Choose a model to visualize</DialogTitle>
          {this._renderContent()}

          <Box sx={{ padding: "15px", textAlign: "right" }}>{actions}</Box>
        </Dialog>
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkSummaries: state.neuralNetwork.networkSummaries,
  };
}

export default connect(mapStateToProps)(NetworkChooser);
