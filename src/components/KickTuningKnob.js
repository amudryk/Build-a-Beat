import React from "react";
import { Knob } from "react-rotary-knob";
import * as skins from "react-rotary-knob-skin-pack";

class KickTuningKnob extends React.Component {
  state = {
    value: 44,
  };

  handleChange = (value) => {
    const maxDistance = 40;
    let distance = Math.abs(value - this.state.value);
    if (distance > maxDistance) {
      return;
    } else {
      this.setState({
        value: value,
      });
    }

    this.props.changeKickDrumTuning(value);
  };

  render() {
    return (
      <React.Fragment>
        <Knob
          style={{
            width: "50%",
            height: "auto",
          }}
          onChange={(value) => {
            this.handleChange(value);
          }}
          min={44}
          max={100}
          value={this.state.value}
          unlockDistance={0}
          preciseMode={false}
          skin={skins.s8}
          {...this.props.rest}
        />{" "}
        <h5 style={{ marginTop: "0rem", marginLeft: "0.1rem", width: "50%" }}>
          Pitch
        </h5>
      </React.Fragment>
    );
  }
}

export default KickTuningKnob;
