import React, { Component } from "react";

class PlayPause extends Component {
  state = {
    playing: false
  };

  handleClick = () => {
    if (this.state.playing) {
      this.props.pause();
    } else {
      this.props.play();
    }
    this.setState({
      playing: !this.state.playing
    });
  };

  render() {

    const playButtonClass = this.state.playing ? 'pause icon' : 'play icon'

    return (
      <div className="huge ui vertical labeled icon buttons">
        <button
          className="play button"
          onClick={this.handleClick}
          style={{
            border: "2px solid black",
            background: "#F7F5E1",
            borderRadius: "13px",
            marginBottom: "1rem"
          }}
        >
          <i className={playButtonClass} />
          {this.state.playing ? "Pause" : "Play"}
        </button>
      </div>
    );
  }
}

export default PlayPause;
