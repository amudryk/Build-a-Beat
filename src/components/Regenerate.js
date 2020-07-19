import React, { Component } from "react";
import * as Tone from "tone";

class Regenerate extends Component {
  handleClick = () => {
    const mutation = 0.5;

    console.log(this.props.chosenBeat);
    console.log(this.props.currentBeat);

    //RANGE 0 - 4
    var wetLevel =
      this.props.chosenBeat.wetLevel * 0.8 +
      this.props.currentBeat.wetLevel * 0.2;

    //RANGE 0.25 - 1.5
    var closedHihatDecayLevel =
      this.props.chosenBeat.closedHihatDecayLevel * 0.8 +
      this.props.currentBeat.closedHihatDecayLevel * 0.2;

    //RANGE 20 - 100
    var kickDrumTuning =
      this.props.chosenBeat.kickDrumTuning * 0.8 +
      this.props.currentBeat.kickDrumTuning * 0.2;

    var fitnessTarget = {
      wetLevel: wetLevel,
      closedHihatDecayLevel: closedHihatDecayLevel,
      kickDrumTuning: kickDrumTuning,
    };

    var population = [];

    //POPULATE 100 random samples
    for (var i = 0; i < 100; i++) {
      var beat = {
        wetLevel: Math.random() * 4,
        closedHihatDecayLevel: Math.random() * 1.25 + 0.25,
        kickDrumTuning: Math.random() * 80 + 20,
        fitness: 0,
      };

      population.push(beat);
    }

    //EVALUATE FITNESS, smaller fitness value = closer fit
    population.forEach((beat) => {
      var fitness = 0;
      fitness += Math.abs(fitnessTarget.wetLevel - beat.wetLevel) / 4;
      fitness +=
        Math.abs(
          fitnessTarget.closedHihatDecayLevel - beat.closedHihatDecayLevel
        ) / 1.25;
      fitness +=
        Math.abs(fitnessTarget.kickDrumTuning - beat.kickDrumTuning) / 80;

      beat.fitness = fitness;
    });

    //FIND TOP 3 FITS
    population.sort((a, b) => {
      if (a.fitness > b.fitness) {
        return 1;
      } else {
        return -1;
      }
    });

    var newBeatParams = [population[0], population[1], population[2]];
    this.props.updateBeats(newBeatParams);
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
          <i className="random icon" />
          Regenerate
        </button>
      </div>
    );
  }
}

export default Regenerate;
