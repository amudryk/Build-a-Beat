import React, { Component } from "react";

class Cell extends Component {
  state = {
    active: false,
    steps: this.props.steps
  };

  clickHandler = event => {
    this.props.stepToggle(this.props.x, this.props.y);

    this.setState({
      steps: this.props.steps
    });
  };

  renderDivColors = () =>
    this.props.steps[this.props.x][this.props.y] === 1
      ? "#FFE4D0"
      : this.props.y % 4 === 0
      ? "#D0D3FF"
      : "#D0EBFF";

  renderBorderMovement = () =>
    this.props.activeColumn === this.props.y
      ? "2px solid #00F9FF"
      : "2px solid black";

  render() {
    return (
      <div
        className="box"
        style={{
          border: this.renderBorderMovement()
        }}
      >
        <div
          className="inner"
          id={this.props.id}
          onClick={this.clickHandler}
          style={{
            background: this.renderDivColors()
          }}
        />
      </div>
    );
  }
}

export default Cell;
