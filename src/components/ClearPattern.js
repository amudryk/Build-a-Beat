import React, { Component } from "react";

class ClearPattern extends Component {
  handleClick = () => {
    this.props.clearPattern();
  };

  render() {
    return (
      <div
        className="huge ui vertical labeled icon buttons"
        onClick={this.handleClick}
      >
        <button
          className="clear pattern button"
          style={{
            border: "2px solid black",
            background: "#F7F5E1",
            borderRadius: "13px",

          }}
        >
          <i className="trash icon" />Clear 
        </button>
      </div>
    );
  }
}

export default ClearPattern;
