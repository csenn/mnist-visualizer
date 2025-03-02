import React from "react";

// export default React.createClass({
export default class LatexRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.latexBox = React.createRef();
  }

  componentDidMount() {
    window.katex.render(this.props.value, this.latexBox.current);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }
  componentDidUpdate() {
    window.katex.render(this.props.value, this.latexBox.current);
  }
  render() {
    return <span ref={this.latexBox} />;
  }
}
