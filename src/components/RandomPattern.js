import React, { Component } from "react";

class RandomPattern extends Component {
  handleClick = () => {
    this.props.randomPattern();
  };

  render() {
    return (
      <div
        className="huge ui vertical labeled icon buttons"
        onClick={this.handleClick}
      >
        <button
          className="random pattern button "
          style={{
            border: "2px solid black",
            background: "#F7F5E1",
            borderRadius: "13px",
          }}
        >
          <i className="random icon" />Randomize
        </button>
      </div>
    );
  }
}

export default RandomPattern;
