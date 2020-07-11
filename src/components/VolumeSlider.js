import React from "react";
import { Knob } from "react-rotary-knob";
import * as skins from "react-rotary-knob-skin-pack";

class VolumeSlider extends React.Component {
  state = {
    value: -3
  };

  handleChange = value => {
    const maxDistance = 5;
    let distance = Math.abs(value - this.state.value);

    if (distance > maxDistance) {
      return;
    } else {
      this.setState({
        value: value
      });
    }

    this.props.changeVolume(value);
  };

  render() {
    return (
      <React.Fragment>
        <Knob
          style={{
            width: "50%",
            height: "auto",
          }}
          onChange={value => {
            this.handleChange(value);
          }}
          min={-12}
          max={0}
          value={this.state.value}
          unlockDistance={0}
          preciseMode={false}
          skin={skins.s8}
          {...this.props.rest}
        />{" "}
        <h5 style={{ margin: "0rem", marginLeft: "0.2rem", width: "50%"}}>Volume (dB)</h5>
      </React.Fragment>
    );
  }
}

export default VolumeSlider;
