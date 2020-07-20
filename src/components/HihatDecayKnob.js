import React from "react";
import { Knob } from "react-rotary-knob";
import * as skins from "react-rotary-knob-skin-pack";

class HihatDecayKnob extends React.Component {
  state = {
    value: 0.25,
  };

  handleChange = (value) => {
    const maxDistance = 1;
    let distance = Math.abs(value - this.state.value);
    if (distance > maxDistance) {
      return;
    } else {
      this.setState({
        value: value,
      });
    }

    this.props.changeCymbalDecayLevel(value);
  };

  render() {
    return (
      <React.Fragment>
        <Knob
          className="whindUp"
          style={{
            width: "auto",
            height: "auto",
          }}
          onChange={(value) => {
            this.handleChange(value);
          }}
          min={0.25}
          max={1.5}
          value={this.state.value}
          unlockDistance={0}
          preciseMode={false}
          skin={skins.s7}
          {...this.props.rest}
        />{" "}
        <h5 style={{ marginTop: "-0.3rem", textAlign: "center", width: "87%" }}>
          Sharpness
        </h5>
      </React.Fragment>
    );
  }
}

export default HihatDecayKnob;
