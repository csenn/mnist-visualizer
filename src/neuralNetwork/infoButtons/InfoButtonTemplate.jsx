import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";

export default class InfoButtons extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    this.state = {
      isOpen: false,
    };
    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }
  _openModal() {
    this.setState({ isOpen: true });
  }
  _closeModal() {
    this.setState({ isOpen: false });
  }
  render() {
    const styles = Object.assign(
      {
        position: "absolute",
      },
      this.props.style,
    );

    const actions = [
      <Button label="Cancel" secondary onClick={this._closeModal} />,
    ];

    /* Make sure content is not rendered until Modal is actually opened,
    some of the charts are data/ calulation intensive. */
    let content = false;
    if (this.state.isOpen) {
      content = (
        <div style={{ lineHeight: "1.7", fontFamily: "Raleway" }}>
          {this.props.renderContent()}
        </div>
      );
    }

    return (
      <span style={styles}>
        <Button
          style={{
            fontSize: "12px",
            width: "160px",
            backgroundColor: "#f5f5f5",
            color: "black",
          }}
          onClick={this._openModal}
          variant="contained"
        >
          {this.props.buttonLabel}
        </Button>
        <Dialog
          title={this.props.modalTitle}
          modal={false}
          open={this.state.isOpen}
          onClose={this._closeModal}
          maxWidth="lg"
        >
          <Box sx={{ padding: "10px" }}>{content}</Box>
          <Box sx={{ padding: "10px", textAlign: "right" }}>{actions}</Box>
        </Dialog>
      </span>
    );
  }
}
