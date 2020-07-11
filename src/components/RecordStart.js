import React, { Component } from "react";

class RecordStart extends Component {
  state = {
    recording: false
  }

  handleClick = () => {
    this.props.record();

    this.setState({
      recording: !this.state.recording
    })
  };

  render() {

    const recordingButtonStyle = this.state.recording ? "red circle icon" : "circle icon"

    return (
      <div
        className="huge ui vertical labeled icon buttons"
        onClick={this.handleClick}
      >
        <button
        className="record start button"
          style={{border: "2px solid black", background: "#F7F5E1", borderRadius: "13px"}}
        >
           <i className={recordingButtonStyle} />
          {this.state.recording ? "Recording..." : "Record"}
        </button>
      </div>
    );
  }
}

export default RecordStart;
